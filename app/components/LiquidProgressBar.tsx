'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { THEME, PROGRESS_STAGES } from '@/app/utils/constants';

interface LiquidProgressBarProps {
  currentStage: typeof PROGRESS_STAGES[number];
  onStageChange?: (stage: typeof PROGRESS_STAGES[number]) => void;
  interactive?: boolean;
}

export function LiquidProgressBar({
  currentStage,
  onStageChange,
  interactive = false,
}: LiquidProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const stageIndex = PROGRESS_STAGES.indexOf(currentStage);
  const progressPercent = ((stageIndex + 1) / PROGRESS_STAGES.length) * 100;

  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering) return;

      const rect = containerRef.current!.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    if (isHovering) {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovering]);

  const handleStageClick = (stage: typeof PROGRESS_STAGES[number]) => {
    if (!interactive || !onStageChange) return;

    const targetIndex = PROGRESS_STAGES.indexOf(stage);
    const currentIndex = stageIndex;

    // Only allow forward progress
    if (targetIndex > currentIndex) {
      onStageChange(stage);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Progress Container */}
      <div
        className="relative h-16 rounded-lg overflow-hidden cursor-pointer transition"
        style={{
          backgroundColor: THEME.colors.ivory,
          border: `2px solid ${THEME.colors.gold}`,
          boxShadow: isHovering ? THEME.shadows.heavyGlow : THEME.shadows.glow,
        }}
      >
        {/* Liquid Fill */}
        <motion.div
          className="absolute h-full"
          style={{
            background: `linear-gradient(90deg, ${THEME.colors.gold}, ${THEME.colors.leather})`,
            left: 0,
          }}
          animate={{
            width: `${progressPercent}%`,
          }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Animated Waves */}
          <svg
            className="absolute w-full h-full"
            viewBox={`0 0 ${containerRef.current?.offsetWidth || 500} 64`}
            style={{
              filter: `drop-shadow(0 0 8px ${THEME.colors.gold}80)`,
            }}
          >
            {isHovering && (
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            )}
          </svg>
        </motion.div>

        {/* Stage Labels & Interactive Points */}
        <div className="absolute inset-0 flex items-center px-4">
          {PROGRESS_STAGES.map((stage, index) => {
            const stagePercent = ((index + 1) / PROGRESS_STAGES.length) * 100;
            const isActive = index <= stageIndex;
            const isCurrentStage = stage === currentStage;

            return (
              <motion.div
                key={stage}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${stagePercent}%`,
                  transform: 'translateX(-50%)',
                }}
                onClick={() => handleStageClick(stage)}
              >
                {/* Indicator Circle */}
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer transition z-10 font-serif"
                  animate={{
                    scale: isCurrentStage ? 1.3 : 1,
                    boxShadow: isCurrentStage
                      ? `0 0 20px ${THEME.colors.gold}, 0 0 40px ${THEME.colors.leather}`
                      : 'none',
                  }}
                  style={{
                    backgroundColor: isActive ? THEME.colors.navy : THEME.colors.charcoal,
                    color: THEME.colors.cream,
                    border: `2px solid ${THEME.colors.gold}`,
                  }}
                >
                  {index + 1}
                </motion.div>

                {/* Stage Label */}
                <motion.div
                  className="text-xs font-serif font-semibold mt-2 whitespace-nowrap"
                  animate={{
                    color: isCurrentStage ? THEME.colors.navy : isActive ? THEME.colors.navy : THEME.colors.slate,
                    textShadow: isCurrentStage ? `0 0 10px ${THEME.colors.gold}` : 'none',
                  }}
                >
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Mouse-Reactive Glow Effect */}
        {isHovering && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 30px ${THEME.colors.gold}`,
              opacity: 0.4,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 0.4, repeat: Infinity }}
          />
        )}
      </div>

      {/* Status Text */}
      <div className="mt-4 text-center">
        <p style={{ color: THEME.colors.navy }} className="text-sm font-serif font-semibold">
          Stage: {currentStage.toUpperCase()} • {progressPercent.toFixed(0)}% Complete
        </p>
        {interactive && (
          <p style={{ color: THEME.colors.slate }} className="text-xs mt-1">
            Click to update progress (forward only)
          </p>
        )}
      </div>
    </div>
  );
}
