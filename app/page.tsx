import Link from "next/link";
import { THEME } from "@/app/utils/constants";
import InteractiveReactor from "@/app/components/InteractiveReactor";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: THEME.gradients.bgGradient }}>
      <div className="text-center mb-12">
        <InteractiveReactor />
        <p className="text-2xl mb-2 font-serif" style={{ color: THEME.colors.navy }}>
          Share. Collaborate. Build.
        </p>
        <p className="text-lg" style={{ color: THEME.colors.slate }}>
          Where startup ideas come to life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-12">
        <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.colors.ivory, boxShadow: THEME.shadows.heavyGlow, border: `1px solid ${THEME.colors.gold}` }}>
          <h3 className="text-xl font-serif font-bold mb-2" style={{ color: THEME.colors.navy }}>Share Ideas</h3>
          <p style={{ color: THEME.colors.charcoal }}>Post your startup ideas and get feedback from your team</p>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.colors.ivory, boxShadow: THEME.shadows.heavyGlow, border: `1px solid ${THEME.colors.gold}` }}>
          <h3 className="text-xl font-serif font-bold mb-2" style={{ color: THEME.colors.navy }}>Collaborate</h3>
          <p style={{ color: THEME.colors.charcoal }}>Add collaborators and work together on ideas in real-time</p>
        </div>

        <div className="p-6 rounded-lg" style={{ backgroundColor: THEME.colors.ivory, boxShadow: THEME.shadows.heavyGlow, border: `1px solid ${THEME.colors.gold}` }}>
          <h3 className="text-xl font-serif font-bold mb-2" style={{ color: THEME.colors.navy }}>Track Progress</h3>
          <p style={{ color: THEME.colors.charcoal }}>Monitor your ideas from concept to launch</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/signup" className="px-8 py-4 rounded-lg font-bold transition hover:scale-105" style={{ background: THEME.gradients.button, color: THEME.colors.cream }}>
          Get Started
        </Link>
        <Link href="/login" className="px-8 py-4 rounded-lg font-bold transition border-2" style={{ borderColor: THEME.colors.navy, color: THEME.colors.navy, backgroundColor: THEME.colors.ivory }}>
          Login
        </Link>
      </div>
    </main>
  );
}
