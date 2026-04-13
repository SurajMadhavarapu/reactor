'use client';

import Link from 'next/link';
import { THEME, PROGRESS_STAGES } from '@/app/utils/constants';
import { motion } from 'framer-motion';

interface IdeaCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  ownerName: string;
  progress: string;
  upvotes: number;
  commentCount: number;
}

export function IdeaCard({
  id,
  title,
  description,
  category,
  ownerName,
  progress,
  upvotes,
  commentCount,
}: IdeaCardProps) {
  const progressIndex = PROGRESS_STAGES.indexOf(progress as any);
  const progressPercent = ((progressIndex + 1) / PROGRESS_STAGES.length) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/ideas/${id}`}>
        <div
          className="p-6 rounded-xl cursor-pointer transition backdrop-blur-sm overflow-hidden relative group"
          style={{
            background: THEME.gradients.card,
            border: `2px solid ${THEME.colors.gold}`,
            boxShadow: THEME.shadows.goldShadow,
          }}
        >
          {/* Animated Background Gradient on Hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: THEME.gradients.cardHover,
              zIndex: -1,
            }}
          />

          {/* Title */}
          <h3
            className="text-xl font-bold mb-3 line-clamp-2 group-hover:opacity-80 transition"
            style={{
              background: THEME.gradients.textGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm mb-4 line-clamp-2 opacity-80" style={{ color: THEME.colors.white }}>
            {description}
          </p>

          {/* Category Badge with Gradient */}
          <div className="mb-4">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: `linear-gradient(135deg, ${THEME.colors.brightOrange}30, ${THEME.colors.gold}20)`,
                color: THEME.colors.brightOrange,
                border: `1px solid ${THEME.colors.brightOrange}`,
              }}
            >
              {category}
            </span>
          </div>

          {/* Progress Bar with Gradient */}
          <div className="mb-4">
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{
                background: `linear-gradient(90deg, ${THEME.colors.darkSteel}40, ${THEME.colors.darkSteel}20)`,
              }}
            >
              <motion.div
                className="h-full"
                style={{
                  background: THEME.gradients.progressGradient,
                }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: THEME.colors.brightOrange }}>
              {progress.charAt(0).toUpperCase() + progress.slice(1)} · {progressPercent.toFixed(0)}%
            </p>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between text-sm border-t pt-4"
            style={{
              borderColor: `${THEME.colors.gold}30`,
            }}
          >
            <span style={{ color: THEME.colors.white }}>
              By <strong style={{ color: THEME.colors.gold }}>{ownerName}</strong>
            </span>

            <div className="flex gap-4">
              <motion.span
                style={{ color: THEME.colors.brightOrange }}
                whileHover={{ scale: 1.1 }}
              >
                ❤️ {upvotes}
              </motion.span>
              <motion.span
                style={{ color: THEME.colors.brightOrange }}
                whileHover={{ scale: 1.1 }}
              >
                💬 {commentCount}
              </motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
