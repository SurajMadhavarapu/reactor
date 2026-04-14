'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/app/utils/validation';
import { ERROR_MESSAGES, THEME } from '@/app/utils/constants';
import { checkAuthRateLimit, getRemainingTime } from '@/app/utils/rateLimiter';
import Link from 'next/link';

// Helper function to add timeout to Firebase calls
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firebase request timed out. Check your internet and Firebase credentials.')), timeoutMs)
    ),
  ]);
}

export function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const isAccountLocked = lockoutTime !== null;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isAccountLocked) {
      const remaining = lockoutTime || 0;
      setError(`Too many signup attempts. Try again in ${remaining} seconds.`);
      return;
    }

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

    // Check rate limit
    const canAttempt = await checkAuthRateLimit(email);
    if (!canAttempt) {
      const remaining = getRemainingTime(email);
      setLockoutTime(remaining);
      setError(`Too many signup attempts. Please try again in ${remaining} seconds.`);
      return;
    }

    setLoading(true);

    try {
      // Create user with 10 second timeout
      const userCredential = await withTimeout(
        createUserWithEmailAndPassword(auth, email, password),
        10000
      );
      const user = userCredential.user;

      // Update profile with timeout
      await withTimeout(
        updateProfile(user, {
          displayName: sanitizeInput(displayName || username),
        }),
        5000
      );

      // Store user data in Firestore with timeout
      await withTimeout(
        setDoc(doc(db, 'users', user.uid), {
          email,
          username: sanitizeInput(username),
          displayName: sanitizeInput(displayName || username),
          createdAt: new Date(),
          updatedAt: new Date(),
          twoFAEnabled: false,
          emailVerified: false,
          authProvider: 'email',
        }),
        5000
      );

      setSuccess(true);
      setLockoutTime(null);
      
      // Use router.push() for client-side navigation
      // This ensures the navigation completes before auth state updates propagate
      router.push('/dashboard');
    } catch (err: any) {
      setLoading(false);
      if (err.code === 'auth/email-already-in-use') {
        setError(ERROR_MESSAGES.auth.emailExists);
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Check your Firebase credentials in .env.local');
      } else if (err.code === 'auth/invalid-api-key') {
        setError('Invalid Firebase API key. Please check your .env.local');
      } else if (err.message && err.message.includes('timed out')) {
        setError('Firebase request timed out. Check your Firebase credentials in .env.local');
      } else {
        console.error('Signup error:', err);
        setError(err.message || ERROR_MESSAGES.network.error);
      }
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
          <p style={{ color: THEME.colors.slate }}>Create your account</p>
        </div>

        <form
          onSubmit={handleSignup}
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

          {success && (
            <div
              className="mb-4 p-3 rounded text-sm"
              style={{
                backgroundColor: '#E8F5E9',
                color: THEME.colors.success,
                borderLeft: `3px solid ${THEME.colors.success}`,
              }}
            >
              Account created! Redirecting to dashboard...
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
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium" style={{ color: THEME.colors.navy }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded focus:outline-none transition"
              style={{
                backgroundColor: THEME.colors.cream,
                borderColor: THEME.colors.gold,
                boxShadow: THEME.shadows.glow,
                border: `1px solid ${THEME.colors.gold}`,
                color: THEME.colors.charcoal,
              }}
              placeholder="your_username"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2 font-medium" style={{ color: THEME.colors.navy }}>
              Display Name (Optional)
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2 rounded focus:outline-none transition"
              style={{
                backgroundColor: THEME.colors.cream,
                borderColor: THEME.colors.gold,
                boxShadow: THEME.shadows.glow,
                border: `1px solid ${THEME.colors.gold}`,
                color: THEME.colors.charcoal,
              }}
              placeholder="John Doe"
            />
          </div>

          <div className="mb-4">
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
              required
            />
            <p className="text-xs mt-2" style={{ color: THEME.colors.slate }}>
              8+ characters, numbers, and special characters required
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2 font-medium" style={{ color: THEME.colors.navy }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded focus:outline-none transition"
              style={{
                backgroundColor: THEME.colors.cream,
                borderColor: THEME.colors.gold,
                boxShadow: THEME.shadows.glow,
                border: `1px solid ${THEME.colors.gold}`,
                color: THEME.colors.charcoal,
              }}
              placeholder="••••••••"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="mt-4 text-center" style={{ color: THEME.colors.charcoal }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: THEME.colors.burgundy }} className="font-bold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
