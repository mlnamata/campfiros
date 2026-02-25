"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    email?: string;
    dietaryNeeds?: string;
  };
};

export async function submitCheckin(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email")?.toString().trim() || "";
  const dietaryNeedsValues = formData.getAll("dietary_needs");
  const dietaryNeeds = dietaryNeedsValues.filter((v): v is string => typeof v === 'string').join(", ");
  const allergies = formData.get("allergies")?.toString().trim() || "";

  // Validation
  const errors: ActionState["errors"] = {};
  if (!email) {
    errors.email = "E-mailová adresa je povinná.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Neplatný formát e-mailu.";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  try {
    // If not connected to Vercel Postgres, standard environment variables will be missing.
    if (!process.env.POSTGRES_URL) {
      console.warn("POSTGRES_URL is not defined. Skipping database insertion. Data received:", { email, dietaryNeeds, allergies });
      return { 
        success: true, 
        message: "Data byla úspěšně přijata. (Varování: Databáze není připojena)" 
      };
    }

    // Upsert check-in data
    await sql`
      INSERT INTO checkins (email, dietary_needs, allergies)
      VALUES (${email}, ${dietaryNeeds}, ${allergies})
      ON CONFLICT (email)
      DO UPDATE SET
        dietary_needs = EXCLUDED.dietary_needs,
        allergies = EXCLUDED.allergies,
        created_at = CURRENT_TIMESTAMP;
    `;

    revalidatePath("/");
    
    return {
      success: true,
      message: "Váš check-in byl úspěšný, děkujeme!"
    };
  } catch (error: any) {
    console.error("Database connection or query error:", error);
    return {
      success: false,
      message: "Nepodařilo se uložit data do databáze. Zkuste to prosím později."
    };
  }
}
