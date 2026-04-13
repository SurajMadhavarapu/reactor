'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/app/utils/validation';
import { ERROR_MESSAGES, THEME } from '@/app/utils/constants';
import Link from 'next/link';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(email)) {
      setError(ERROR_MESSAGES.auth.invalidEmail);
      return;
    }

    if (!validateUsername(username)) {
      setError('Username must be 3-30 characters (letters, numbers, underscore, hyphen only)');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Create user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile
      await updateProfile(user, {
        displayName: sanitizeInput(displayName || username),
      });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        username: sanitizeInput(username),
        displayName: sanitizeInput(displayName || username),
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFAEnabled: false,
        emailVerified: false,
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/verify-email';
      }, 2000);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError(ERROR_MESSAGES.auth.emailExists);
      } else {
        setError(err.message || ERROR_MESSAGES.network.error);
      }
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
          <p style={{ color: THEME.colors.white }}>Create your account</p>
        </div>

        <form
          onSubmit={handleSignup}
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

          {success && (
            <div
              className="mb-4 p-3 rounded text-sm"
              style={{
                backgroundColor: `${THEME.colors.success}20`,
                color: THEME.colors.success,
                borderLeft: `3px solid ${THEME.colors.success}`,
              }}
            >
              Account created! Redirecting to email verification...
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
              style={{
                borderColor: THEME.colors.gold,
                color: THEME.colors.white,
              }}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: THEME.colors.gold }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 bg-transparent text-white focus:outline-none transition"
              style={{ borderColor: THEME.colors.gold }}
              placeholder="your_username"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2" style={{ color: THEME.colors.gold }}>
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 bg-transparent text-white focus:outline-none transition"
              style={{ borderColor: THEME.colors.gold }}
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
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
              required
            />
            <p className="text-xs mt-2" style={{ color: THEME.colors.brightOrange }}>
              8+ characters, numbers, and special characters required
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2" style={{ color: THEME.colors.gold }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded border-2 bg-transparent text-white focus:outline-none transition"
              style={{ borderColor: THEME.colors.gold }}
              placeholder="••••••••"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="mt-4 text-center" style={{ color: THEME.colors.white }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: THEME.colors.gold }} className="font-bold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
