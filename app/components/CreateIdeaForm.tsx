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
    <div style={{ backgroundColor: THEME.colors.darkBg }} className="min-h-screen p-6">
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
            style={{ color: THEME.colors.darkSteel }}
          >
            💡 Launch Your Idea
          </h1>
          <p style={{ color: THEME.colors.brightOrange }} className="opacity-80">
            Share your startup vision with the community
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="p-8 rounded-xl"
          style={{
            backgroundColor: THEME.colors.white,
            boxShadow: THEME.shadows.heavyGlow,
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {error && (
            <motion.div
              className="mb-6 p-4 rounded-lg text-sm"
              style={{
                backgroundColor: '#FFEBEE',
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
              className="mb-6 p-4 rounded-lg text-sm"
              style={{
                backgroundColor: '#E8F5E9',
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
              style={{ color: THEME.colors.darkSteel }}
            >
              Idea Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none transition"
              style={{
                backgroundColor: THEME.colors.darkBg,
                boxShadow: THEME.shadows.glow,
                border: `1px solid ${THEME.colors.borderColor}`,
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
              style={{ color: THEME.colors.darkSteel }}
            >
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none transition resize-none"
              style={{
                backgroundColor: THEME.colors.darkBg,
                boxShadow: THEME.shadows.glow,
                border: `1px solid ${THEME.colors.borderColor}`,
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
              style={{ color: THEME.colors.darkSteel }}
            >
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none transition"
              style={{
                backgroundColor: THEME.colors.darkBg,
                boxShadow: THEME.shadows.glow,
                border: `1px solid ${THEME.colors.borderColor}`,
              }}
              required
            >
              <option value="">Select a category...</option>
              <option value="SaaS">SaaS</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Web App">Web App</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Hardware">Hardware</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Social">Social</option>
              <option value="Finance">Finance</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-lg font-bold text-lg transition"
            style={{
              background: THEME.gradients.button,
              color: THEME.colors.white,
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

