'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { validateEmail, validatePassword, validateUsername, sanitizeInput } from '@/app/utils/validation';
import { ERROR_MESSAGES, THEME } from '@/app/utils/constants';
import { signInWithGoogle } from '@/app/utils/googleAuth';
import { checkAuthRateLimit, getRemainingTime } from '@/app/utils/rateLimiter';
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
        authProvider: 'email',
      });

      setSuccess(true);
      setLockoutTime(null);
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

  const handleGoogleSignUp = async () => {
    setError('');
    
    // Check rate limit for Google signup
    const canAttempt = await checkAuthRateLimit(`google:${email || 'unknown'}`);
    if (!canAttempt) {
      const remaining = getRemainingTime(`google:${email || 'unknown'}`);
      setLockoutTime(remaining);
      setError(`Too many signup attempts. Please try again in ${remaining} seconds.`);
      return;
    }

    setLoading(true);
    try {
      await signInWithGoogle();
      setSuccess(true);
      setLockoutTime(null);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed');
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
              Account created! Redirecting to email verification...
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

          {/* Divider */}
          <div className="flex items-center my-6">
            <div style={{ flex: 1, height: '1px', backgroundColor: THEME.colors.gold }} />
            <span style={{ margin: '0 12px', color: THEME.colors.slate, fontSize: '14px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: THEME.colors.gold }} />
          </div>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-3 rounded font-bold transition flex items-center justify-center gap-2 hover:opacity-90"
            style={{
              backgroundColor: THEME.colors.white,
              color: THEME.colors.navy,
              border: `1px solid ${THEME.colors.gold}`,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? 'Creating Account...' : 'Sign up with Google'}
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
