import { CheckinForm } from "@/components/CheckinForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 sm:p-8 font-[family-name:var(--font-geist-sans)]">

      {/* Background decorations */}
      <div className="absolute top-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-blue-400/10 blur-3xl opacity-50 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-purple-400/10 blur-3xl opacity-50 mix-blend-multiply"></div>
      </div>

      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-indigo-100/50 border border-white p-8 sm:p-10 relative overflow-hidden">

        {/* Decorative thin top line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600 mb-6 shadow-sm border border-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Check-in CampFire
          </h1>
          <p className="text-gray-500 mt-3 text-sm sm:text-base px-2">
            Prosím o vyplnění dodatečných informací pro hladký průběh události.
          </p>
        </div>

        <CheckinForm />

      </div>

      <p className="mt-8 text-xs text-gray-400 font-medium tracking-wide">
        Zabezpečeno & Šifrováno
      </p>
    </main>
  );
}
