'use client';

import { useState } from 'react';
import { verifyIdeaPin } from '@/app/utils/firebaseUtils';
import { THEME } from '@/app/utils/constants';

interface PinVerificationProps {
  ideaId: string;
  userId: string;
  userName: string;
  onSuccess: () => void;
}

export function PinVerification({ ideaId, userId, userName, onSuccess }: PinVerificationProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }

    if (!/^\d+$/.test(pin)) {
      setError('PIN must contain only numbers');
      return;
    }

    setLoading(true);

    try {
      await verifyIdeaPin(ideaId, userId, userName, pin);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to verify PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: THEME.gradients.bgGradient }} className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ color: THEME.colors.navy }}>
            Protected Idea
          </h1>
          <p style={{ color: THEME.colors.slate }}>Enter the 6-digit PIN to view details</p>
        </div>

        <form
          onSubmit={handleSubmit}
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

          <div className="mb-6">
            <label className="block text-sm mb-2 font-medium" style={{ color: THEME.colors.navy }}>
              6-Digit PIN
            </label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 rounded text-center text-2xl tracking-widest focus:outline-none transition"
              style={{
                backgroundColor: THEME.colors.cream,
                borderColor: THEME.colors.gold,
                boxShadow: THEME.shadows.glow,
                border: `1px solid ${THEME.colors.gold}`,
                color: THEME.colors.charcoal,
                letterSpacing: '0.5em',
              }}
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              required
            />
            <p className="text-xs mt-2" style={{ color: THEME.colors.slate }}>
              {pin.length}/6 digits entered
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || pin.length !== 6}
            className="w-full py-3 rounded font-bold transition hover:opacity-90"
            style={{
              background: THEME.gradients.button,
              color: THEME.colors.cream,
              opacity: loading || pin.length !== 6 ? 0.6 : 1,
            }}
          >
            {loading ? 'Verifying...' : 'Unlock Idea'}
          </button>
        </form>
      </div>
    </div>
  );
}
