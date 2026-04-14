'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { validateEmail, sanitizeInput } from '@/app/utils/validation';
import { ERROR_MESSAGES, THEME, RATE_LIMITS } from '@/app/utils/constants';
import { checkAuthRateLimit, getRemainingTime } from '@/app/utils/rateLimiter';
import Link from 'next/link';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const isAccountLocked = lockoutTime !== null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAccountLocked) {
      const remaining = lockoutTime || 0;
      setError(`Too many failed attempts. Try again in ${remaining} seconds.`);
      return;
    }

    if (!validateEmail(email)) {
      setError(ERROR_MESSAGES.auth.invalidEmail);
      return;
    }

    // Check rate limit
    const canAttempt = await checkAuthRateLimit(email);
    if (!canAttempt) {
      const remaining = getRemainingTime(email);
      setLockoutTime(remaining);
      setError(`Too many login attempts. Please try again in ${remaining} seconds.`);
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setFailedAttempts(0);
      setLockoutTime(null);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err: any) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (err.code === 'auth/invalid-credential') {
        setError(ERROR_MESSAGES.auth.invalidCredentials);
      } else if (err.code === 'auth/user-not-found') {
        setError('Email not found. Please sign up.');
      } else {
        setError(err.message || ERROR_MESSAGES.network.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetEmailSent(false);

    if (!validateEmail(resetEmail)) {
      setError(ERROR_MESSAGES.auth.invalidEmail);
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      setTimeout(() => {
        setShowResetForm(false);
        setResetEmail('');
      }, 2000);
    } catch (err: any) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.gradients.bgGradient }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ color: THEME.colors.navy }}>
            REACTOR
          </h1>
          <p style={{ color: THEME.colors.slate }}>Welcome back</p>
        </div>

        {!showResetForm ? (
          <form
            onSubmit={handleLogin}
            className="p-8 rounded-lg"
            style={{
              backgroundColor: THEME.colors.ivory,
              boxShadow: THEME.shadows.heavyGlow,
              border: `1px solid ${THEME.colors.gold}`,
            }}
          >
            {error && (
              <div
                className="mb-4 p-3 rounded text-sm"
                style={{
                  backgroundColor: '#FFEBEE',
                  color: THEME.colors.error,
                  borderLeft: `3px solid ${THEME.colors.error}`,
                }}
              >
                {error}
              </div>
            )}

            {isAccountLocked && (
              <div
                className="mb-4 p-3 rounded text-sm"
                style={{
                  backgroundColor: `${THEME.colors.warning}20`,
                  color: THEME.colors.warning,
                }}
              >
                Too many failed attempts. Please wait 15 minutes or reset your password.
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm mb-2 font-medium" style={{ color: THEME.colors.navy }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded focus:outline-none transition"
                style={{
                  backgroundColor: THEME.colors.cream,
                  borderColor: THEME.colors.gold,
                  boxShadow: THEME.shadows.glow,
                  border: `1px solid ${THEME.colors.gold}`,
                  color: THEME.colors.charcoal,
                }}
                placeholder="you@example.com"
                disabled={isAccountLocked}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 font-medium" style={{ color: THEME.colors.navy }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded focus:outline-none transition"
                style={{
                  backgroundColor: THEME.colors.cream,
                  borderColor: THEME.colors.gold,
                  boxShadow: THEME.shadows.glow,
                  border: `1px solid ${THEME.colors.gold}`,
                  color: THEME.colors.charcoal,
                }}
                placeholder="••••••••"
                disabled={isAccountLocked}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || isAccountLocked}
              className="w-full py-3 rounded font-bold transition hover:opacity-90"
              style={{
                background: THEME.gradients.button,
                color: THEME.colors.cream,
                opacity: loading || isAccountLocked ? 0.6 : 1,
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              className="w-full mt-3 py-2 text-sm rounded transition hover:opacity-80"
              style={{ color: THEME.colors.navy }}
            >
              Forgot Password?
            </button>

            <p className="mt-4 text-center" style={{ color: THEME.colors.charcoal }}>
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: THEME.colors.burgundy }} className="font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handlePasswordReset}
            className="p-8 rounded-lg"
            style={{
              backgroundColor: THEME.colors.ivory,
              boxShadow: THEME.shadows.heavyGlow,
              border: `1px solid ${THEME.colors.gold}`,
            }}
          >
            <h2 className="text-xl font-serif font-bold mb-4" style={{ color: THEME.colors.navy }}>
              Reset Password
            </h2>

            {error && (
              <div
                className="mb-4 p-3 rounded text-sm"
                style={{
                  backgroundColor: '#FFEBEE',
                  color: THEME.colors.error,
                }}
              >
                {error}
              </div>
            )}

            {resetEmailSent && (
              <div
                className="mb-4 p-3 rounded text-sm"
                style={{
                  backgroundColor: '#E8F5E9',
                  color: THEME.colors.success,
                }}
              >
                Reset link sent! Check your email.
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm mb-2 font-medium" style={{ color: THEME.colors.navy }}>
                Email
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-2 rounded focus:outline-none transition"
                style={{
                  backgroundColor: THEME.colors.cream,
                  borderColor: THEME.colors.gold,
                  boxShadow: THEME.shadows.glow,
                  border: `1px solid ${THEME.colors.gold}`,
                  color: THEME.colors.charcoal,
                }}
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-bold transition hover:opacity-90"
              style={{
                background: THEME.gradients.button,
                color: THEME.colors.cream,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setShowResetForm(false)}
              className="w-full mt-3 py-2 text-sm rounded transition hover:opacity-80"
              style={{ color: THEME.colors.navy }}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
