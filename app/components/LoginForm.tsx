'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { validateEmail, sanitizeInput } from '@/app/utils/validation';
import { ERROR_MESSAGES, THEME, RATE_LIMITS } from '@/app/utils/constants';
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

  const isAccountLocked = failedAttempts >= RATE_LIMITS.loginAttempts;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAccountLocked) {
      setError(ERROR_MESSAGES.auth.accountLocked);
      return;
    }

    if (!validateEmail(email)) {
      setError(ERROR_MESSAGES.auth.invalidEmail);
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setFailedAttempts(0);
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

      if (newAttempts >= RATE_LIMITS.loginAttempts) {
        setError(ERROR_MESSAGES.auth.accountLocked);
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
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: THEME.colors.darkBg }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ color: THEME.colors.gold }}>
            ⚛️ REACTOR
          </h1>
          <p style={{ color: THEME.colors.white }}>Welcome back</p>
        </div>

        {!showResetForm ? (
          <form
            onSubmit={handleLogin}
            className="p-8 rounded-lg"
            style={{
              backgroundColor: THEME.colors.cardBg,
              border: `2px solid ${THEME.colors.gold}`,
            }}
          >
            {error && (
              <div
                className="mb-4 p-3 rounded text-sm"
                style={{
                  backgroundColor: `${THEME.colors.error}20`,
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
              <label className="block text-sm mb-2" style={{ color: THEME.colors.gold }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded border-2 bg-transparent text-white focus:outline-none transition"
                style={{ borderColor: THEME.colors.gold }}
                placeholder="you@example.com"
                disabled={isAccountLocked}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ color: THEME.colors.gold }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded border-2 bg-transparent text-white focus:outline-none transition"
                style={{ borderColor: THEME.colors.gold }}
                placeholder="••••••••"
                disabled={isAccountLocked}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || isAccountLocked}
              className="w-full py-3 rounded font-bold transition"
              style={{
                backgroundColor: THEME.colors.gold,
                color: THEME.colors.darkSteel,
                opacity: loading || isAccountLocked ? 0.6 : 1,
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              className="w-full mt-3 py-2 text-sm rounded transition"
              style={{ color: THEME.colors.brightOrange }}
            >
              Forgot Password?
            </button>

            <p className="mt-4 text-center" style={{ color: THEME.colors.white }}>
              Don't have an account?{' '}
              <Link href="/signup" style={{ color: THEME.colors.gold }} className="font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handlePasswordReset}
            className="p-8 rounded-lg"
            style={{
              backgroundColor: THEME.colors.cardBg,
              border: `2px solid ${THEME.colors.gold}`,
            }}
          >
            <h2 className="text-xl font-bold mb-4" style={{ color: THEME.colors.gold }}>
              Reset Password
            </h2>

            {error && (
              <div
                className="mb-4 p-3 rounded text-sm"
                style={{
                  backgroundColor: `${THEME.colors.error}20`,
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
                  backgroundColor: `${THEME.colors.success}20`,
                  color: THEME.colors.success,
                }}
              >
                Reset link sent! Check your email.
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ color: THEME.colors.gold }}>
                Email
              </label>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full px-4 py-2 rounded border-2 bg-transparent text-white focus:outline-none transition"
                style={{ borderColor: THEME.colors.gold }}
                placeholder="you@example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded font-bold transition"
              style={{
                backgroundColor: THEME.colors.gold,
                color: THEME.colors.darkSteel,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setShowResetForm(false)}
              className="w-full mt-3 py-2 text-sm rounded transition"
              style={{ color: THEME.colors.brightOrange }}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
