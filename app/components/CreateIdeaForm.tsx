'use client';

import { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { createIdea } from '@/app/utils/firebaseUtils';
import { validateIdeaTitle, validateIdeaDescription, sanitizeInput } from '@/app/utils/validation';
import { ERROR_MESSAGES, THEME, VALIDATION } from '@/app/utils/constants';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function CreateIdeaForm() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login first');
      return;
    }

    if (!validateIdeaTitle(title)) {
      setError(`Title must be between 1-${VALIDATION.idea.titleMaxLength} characters`);
      return;
    }

    if (!validateIdeaDescription(description)) {
      setError(`Description must be between 1-${VALIDATION.idea.descriptionMaxLength} characters`);
      return;
    }

    if (!category.trim()) {
      setError('Please select a category');
      return;
    }

    setLoading(true);

    try {
      const ideaId = await createIdea(
        user.uid,
        user.displayName || user.email || 'Anonymous',
        sanitizeInput(title),
        sanitizeInput(description),
        sanitizeInput(category)
      );

      setSuccess(true);
      setTimeout(() => {
        router.push(`/ideas/${ideaId}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.network.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: THEME.gradients.bgGradient }} className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/ideas"
            className="text-sm mb-4 inline-block hover:opacity-80 transition"
            style={{ color: THEME.colors.brightOrange }}
          >
            ← Back to Ideas
          </Link>
          <h1
            className="text-5xl font-bold mb-3"
            style={{
              background: THEME.gradients.hero,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            💡 Launch Your Idea
          </h1>
          <p style={{ color: THEME.colors.white }} className="opacity-80">
            Share your startup vision with the community
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="p-8 rounded-xl backdrop-blur-sm"
          style={{
            background: THEME.gradients.card,
            border: `3px solid ${THEME.colors.gold}`,
            boxShadow: THEME.shadows.goldShadow,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {error && (
            <motion.div
              className="mb-6 p-4 rounded-lg text-sm backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, rgba(220, 53, 69, 0.15) 0%, rgba(220, 53, 69, 0.05) 100%)`,
                color: THEME.colors.error,
                border: `2px solid ${THEME.colors.error}`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              className="mb-6 p-4 rounded-lg text-sm backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, rgba(40, 167, 69, 0.15) 0%, rgba(40, 167, 69, 0.05) 100%)`,
                color: THEME.colors.success,
                border: `2px solid ${THEME.colors.success}`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ Idea created! Redirecting to your dashboard...
            </motion.div>
          )}

          {/* Title */}
          <motion.div className="mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <label
              className="block text-sm font-semibold mb-3"
              style={{
                background: THEME.gradients.accentGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Idea Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-transparent text-white focus:outline-none transition backdrop-blur-sm"
              style={{
                border: `2px solid ${THEME.colors.gold}`,
                boxShadow: `inset 0 0 10px ${THEME.colors.gold}20`,
              }}
              placeholder="e.g., AI-powered meal planning app"
              maxLength={VALIDATION.idea.titleMaxLength}
              required
            />
            <p className="text-xs mt-2 opacity-70" style={{ color: THEME.colors.brightOrange }}>
              {title.length}/{VALIDATION.idea.titleMaxLength} characters
            </p>
          </motion.div>

          {/* Description */}
          <motion.div className="mb-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label
              className="block text-sm font-semibold mb-3"
              style={{
                background: THEME.gradients.accentGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-transparent text-white focus:outline-none transition resize-none backdrop-blur-sm"
              style={{
                border: `2px solid ${THEME.colors.gold}`,
                boxShadow: `inset 0 0 10px ${THEME.colors.gold}20`,
              }}
              placeholder="Describe your startup idea: problem, solution, target market..."
              rows={6}
              maxLength={VALIDATION.idea.descriptionMaxLength}
              required
            />
            <p className="text-xs mt-2 opacity-70" style={{ color: THEME.colors.brightOrange }}>
              {description.length}/{VALIDATION.idea.descriptionMaxLength} characters
            </p>
          </motion.div>

          {/* Category */}
          <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <label
              className="block text-sm font-semibold mb-3"
              style={{
                background: THEME.gradients.accentGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-transparent text-white focus:outline-none transition backdrop-blur-sm"
              style={{
                border: `2px solid ${THEME.colors.gold}`,
                boxShadow: `inset 0 0 10px ${THEME.colors.gold}20`,
              }}
              required
            >
              <option value="" style={{ color: THEME.colors.darkSteel }}>
                Select a category...
              </option>
              <option value="SaaS" style={{ color: THEME.colors.darkSteel }}>
                SaaS
              </option>
              <option value="Mobile App" style={{ color: THEME.colors.darkSteel }}>
                Mobile App
              </option>
              <option value="Web App" style={{ color: THEME.colors.darkSteel }}>
                Web App
              </option>
              <option value="AI/ML" style={{ color: THEME.colors.darkSteel }}>
                AI/ML
              </option>
              <option value="Hardware" style={{ color: THEME.colors.darkSteel }}>
                Hardware
              </option>
              <option value="E-commerce" style={{ color: THEME.colors.darkSteel }}>
                E-commerce
              </option>
              <option value="Social" style={{ color: THEME.colors.darkSteel }}>
                Social
              </option>
              <option value="Finance" style={{ color: THEME.colors.darkSteel }}>
                Finance
              </option>
              <option value="Health" style={{ color: THEME.colors.darkSteel }}>
                Health
              </option>
              <option value="Education" style={{ color: THEME.colors.darkSteel }}>
                Education
              </option>
              <option value="Other" style={{ color: THEME.colors.darkSteel }}>
                Other
              </option>
            </select>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg font-bold text-lg transition shadow-lg"
            style={{
              background: THEME.gradients.button,
              color: THEME.colors.darkSteel,
              opacity: loading ? 0.6 : 1,
              boxShadow: THEME.shadows.heavyGlow,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? '⚙️ Creating your idea...' : '🚀 Launch Idea'}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

