import Link from "next/link";
import { THEME } from "@/app/utils/constants";
import InteractiveReactor from "@/app/components/InteractiveReactor";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: THEME.colors.darkBg }}>
      <div className="text-center mb-12">
        <InteractiveReactor />
        <p className="text-2xl mb-2" style={{ color: '#000000' }}>
          Share. Collaborate. Build.
        </p>
        <p className="text-lg" style={{ color: '#000000' }}>
          Where startup ideas come to life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
        <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.colors.white, boxShadow: THEME.shadows.heavyGlow }}>
          <div className="text-3xl mb-3">💡</div>
          <h3 style={{ color: '#000000' }} className="text-xl font-bold mb-2">Share Ideas</h3>
          <p style={{ color: '#000000' }}>Post your startup ideas and get feedback from your team</p>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.colors.white, boxShadow: THEME.shadows.heavyGlow }}>
          <div className="text-3xl mb-3">🤝</div>
          <h3 style={{ color: '#000000' }} className="text-xl font-bold mb-2">Collaborate</h3>
          <p style={{ color: '#000000' }}>Add collaborators and work together on ideas in real-time</p>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.colors.white, boxShadow: THEME.shadows.heavyGlow }}>
          <div className="text-3xl mb-3">📊</div>
          <h3 style={{ color: '#000000' }} className="text-xl font-bold mb-2">Track Progress</h3>
          <p style={{ color: '#000000' }}>Monitor your ideas from concept to launch</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/signup" className="px-8 py-4 rounded-lg font-bold transition hover:scale-105" style={{ backgroundColor: THEME.colors.darkSteel, color: '#000000' }}>
          Get Started
        </Link>
        <Link href="/login" className="px-8 py-4 rounded-lg font-bold transition border-2" style={{ borderColor: THEME.colors.darkSteel, color: '#000000', backgroundColor: THEME.colors.white }}>
          Login
        </Link>
      </div>
    </main>
  );
}
