'use client';

import { THEME } from '@/app/utils/constants';

export default function CornerEmojis() {
  const emojis = ['🚀', '💡', '📈'];

  return (
    <>
      {/* Bottom Left Corner */}
      <div className="fixed bottom-0 left-0 pointer-events-none" style={{ width: '300px', height: '300px' }}>
        {emojis.map((emoji, idx) => {
          const angle = (idx * 45); // Spread at 45 degree intervals
          const distance = 80 + idx * 40; // Different distances from corner
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * distance;
          const y = Math.sin(radians) * distance;

          return (
            <div
              key={`left-${idx}`}
              style={{
                position: 'absolute',
                fontSize: '32px',
                left: `${x}px`,
                bottom: `${y}px`,
                opacity: 0.6,
                transform: `scale(${0.8 + idx * 0.15})`,
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>

      {/* Bottom Right Corner */}
      <div className="fixed bottom-0 right-0 pointer-events-none" style={{ width: '300px', height: '300px' }}>
        {emojis.map((emoji, idx) => {
          const angle = 180 - (idx * 45); // Mirror angle for right side
          const distance = 80 + idx * 40;
          const radians = (angle * Math.PI) / 180;
          const x = Math.cos(radians) * distance;
          const y = Math.sin(radians) * distance;

          return (
            <div
              key={`right-${idx}`}
              style={{
                position: 'absolute',
                fontSize: '32px',
                right: `${-x}px`,
                bottom: `${y}px`,
                opacity: 0.6,
                transform: `scale(${0.8 + idx * 0.15})`,
              }}
            >
              {emoji}
            </div>
          );
        })}
      </div>
    </>
  );
}
