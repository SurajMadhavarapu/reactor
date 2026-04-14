'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { THEME } from '@/app/utils/constants';
import Link from 'next/link';
import ArcReactorBackground from '@/app/components/ArcReactorBackground';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, authenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      router.push('/login');
    }
  }, [loading, authenticated, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: THEME.colors.cream }}>
        <div
          className="text-2xl font-bold font-serif"
          style={{
            color: THEME.colors.navy,
            animation: 'pulse 2s infinite',
          }}
        >
          Loading REACTOR...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <ArcReactorBackground opacity={0.2} />
      <div className="relative" style={{ backgroundColor: THEME.colors.cream }}>
        {/* Navigation Bar */}
        <nav
          className="relative flex justify-between items-center px-6 py-4 z-20"
          style={{
            backgroundColor: THEME.colors.navy,
            borderBottom: `2px solid ${THEME.colors.gold}`,
          }}
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-serif" style={{ color: THEME.colors.gold }}>
              REACTOR
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            <span style={{ color: THEME.colors.cream }}>
              Welcome, <strong>{user?.displayName || user?.email}</strong>
            </span>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded font-bold transition hover:opacity-90"
              style={{
                backgroundColor: THEME.colors.burgundy,
                color: THEME.colors.cream,
              }}
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="relative min-h-screen p-6 z-10">
          {children}
        </main>
      </div>
    </>
  );
}
