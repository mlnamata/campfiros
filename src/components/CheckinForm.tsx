"use client";

import React, { useActionState, useState } from "react";
import { submitCheckin, ActionState } from "@/app/actions";
import { Loader2, CheckCircle } from "lucide-react";

export function CheckinForm() {
    const [state, action, isPending] = useActionState<ActionState, FormData>(
        submitCheckin,
        { success: false }
    );

    const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
    const [email, setEmail] = useState("");
    const [clientError, setClientError] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (clientError) setClientError("");
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        if (!email) {
            e.preventDefault();
            setClientError("E-mailová adresa je povinná.");
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.preventDefault();
            setClientError("Neplatný formát e-mailu.");
            return;
        }
    };

    const handleDietChange = (diet: string) => {
        setSelectedDiets(prev =>
            prev.includes(diet)
                ? prev.filter(d => d !== diet)
                : [...prev, diet]
        );
    };

    if (state.success) {
        return (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-16 h-16 text-emerald-500 mb-6 drop-shadow-sm" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {state.message || "Váš check-in byl úspěšný, děkujeme!"}
                </h2>
                <p className="text-gray-500">
                    Můžete toto okno zavřít.
                </p>
            </div>
        );
    }

    return (
        <form action={action} onSubmit={handleFormSubmit} className="space-y-6">
            {state.message && !state.success && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                    {state.message}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    E-mailová adresa z registrace <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="např. jan.novak@email.cz"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50/50 hover:bg-gray-50 text-gray-900"
                />
                {(clientError || state.errors?.email) && (
                    <p className="text-red-500 text-sm mt-1">{clientError || state.errors?.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Vaše stravovací požadavky
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        "Bez omezení",
                        "Vegetariánská",
                        "Veganská",
                        "Bezlepková",
                        "Bez laktózy",
                        "Jiné"
                    ].map((diet) => (
                        <label key={diet} className="flex items-center p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors group">
                            <input
                                type="checkbox"
                                name="dietary_needs"
                                value={diet}
                                checked={selectedDiets.includes(diet)}
                                onChange={() => handleDietChange(diet)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">{diet}</span>
                        </label>
                    ))}
                </div>
            </div>

            {selectedDiets.includes("Jiné") && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    <label htmlFor="dietary_needs_other" className="block text-sm font-semibold text-gray-700">
                        Upřesněte jiné stravovací požadavky <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="dietary_needs_other"
                        name="dietary_needs_other"
                        rows={2}
                        required
                        placeholder="Např. alergie na ořechy, keto, atd."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50/50 hover:bg-gray-50 resize-y text-gray-900"
                    ></textarea>
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700">
                    Alergie
                </label>
                <textarea
                    id="allergies"
                    name="allergies"
                    rows={3}
                    placeholder="Vypište jakékoliv alergie na potraviny. Pokud žádné nemáte, ponechte prázdné."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50/50 hover:bg-gray-50 resize-y text-gray-900"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-[0.98]"
            >
                {isPending ? (
                    <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Zpracovávám...
                    </>
                ) : (
                    "Dokončit check-in"
                )}
            </button>
        </form>
    );
}
