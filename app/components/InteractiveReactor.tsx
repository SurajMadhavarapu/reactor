'use client';

import { useState, useEffect, useRef } from 'react';
import { THEME } from '@/app/utils/constants';

export default function InteractiveReactor() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate rotation based on entire viewport, not just container
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Calculate normalized position (0 to 1, where 0.5 is center)
      const normalizedX = e.clientX / screenWidth;
      const normalizedY = e.clientY / screenHeight;
      
      // Convert to range of -1 to 1 (center at 0)
      const centerX = normalizedX - 0.5;
      const centerY = normalizedY - 0.5;
      
      // Max rotation is 45 degrees at edges
      const rotateY = centerX * 2 * 45; // -45 to +45
      const rotateX = -centerY * 2 * 45; // -45 to +45
      
      setRotation({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        perspective: '1000px',
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 48px',
      }}
    >
      <div
        style={{
          fontSize: '120px',
          fontWeight: 'bold',
          fontFamily: 'var(--font-playfair)',
          background: THEME.gradients.textGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'text-shadow 0.1s ease-out, transform 0.05s ease-out',
          textShadow: `
            ${Math.cos((rotation.y * Math.PI) / 180) * 20}px ${Math.sin((rotation.x * Math.PI) / 180) * 20}px 30px rgba(27, 38, 59, 0.3),
            ${Math.cos((rotation.y * Math.PI) / 180) * 10}px ${Math.sin((rotation.x * Math.PI) / 180) * 10}px 15px rgba(197, 168, 128, 0.2),
            0 0 40px rgba(197, 168, 128, 0.1)
          `,
          willChange: 'transform, text-shadow',
        }}
      >
        REACTOR
      </div>
    </div>
  );
}
