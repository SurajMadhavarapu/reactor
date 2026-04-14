'use client';

import { DashboardLayout } from '@/app/components/DashboardLayout';
import { THEME } from '@/app/utils/constants';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ color: THEME.colors.navy }}>
            Welcome to REACTOR
          </h1>
          <p style={{ color: THEME.colors.slate }}>
            Where your startup ideas transform into reality
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/ideas/new"
            className="p-8 rounded-lg font-bold text-lg transition hover:scale-105"
            style={{
              background: THEME.gradients.button,
              color: THEME.colors.cream,
              textDecoration: 'none',
            }}
          >
            Create New Idea
          </Link>

          <Link
            href="/ideas"
            className="p-8 rounded-lg font-bold text-lg transition border-2"
            style={{
              backgroundColor: 'transparent',
              borderColor: THEME.colors.navy,
              color: THEME.colors.navy,
              textDecoration: 'none',
            }}
          >
            Browse All Ideas
          </Link>
        </div>

        {/* Placeholder for Recent Ideas */}
        <div
          className="p-8 rounded-lg"
          style={{
            backgroundColor: THEME.colors.ivory,
            border: `2px solid ${THEME.colors.gold}`,
            boxShadow: THEME.shadows.card,
          }}
        >
          <h2 style={{ color: THEME.colors.navy }} className="text-2xl font-serif font-bold mb-4">
            Recent Ideas
          </h2>
          <p style={{ color: THEME.colors.charcoal }}>
            No ideas yet. Create your first idea to get started!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
