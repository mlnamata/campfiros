"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: {
    email?: string;
    dietaryNeeds?: string;
  };
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function submitCheckin(
  prevState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email")?.toString().trim() || "";
  const dietaryNeedsValues = formData.getAll("dietary_needs");
  const dietaryNeedsOther = formData.get("dietary_needs_other")?.toString().trim() || "";

  const dietaryNeeds = dietaryNeedsValues
    .filter((v): v is string => typeof v === 'string')
    .map(v => v === "Jiné" && dietaryNeedsOther ? `Jiné (${dietaryNeedsOther})` : v)
    .join(", ");

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
    // Check for Supabase environment variables
    if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === "your_supabase_project_url") {
      console.warn("Supabase credentials are not defined or are placeholders. Skipping database insertion. Data received:", { email, dietaryNeeds, allergies });
      return {
        success: true,
        message: "Data byla úspěšně přijata. "
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert check-in data in Supabase
    const { error } = await supabase
      .from("checkins")
      .upsert(
        {
          email,
          dietary_needs: dietaryNeeds,
          allergies,
          created_at: new Date().toISOString()
        },
        { onConflict: "email" }
      );

    if (error) {
      throw error;
    }

    revalidatePath("/");

    return {
      success: true,
      message: "Váš check-in byl úspěšný, děkujeme!"
    };
  } catch (error: unknown) {
    console.error("Supabase connection or query error:", error);
    return {
      success: false,
      message: "Nepodařilo se uložit data do databáze. Zkuste to prosím později."
    };
  }
}
