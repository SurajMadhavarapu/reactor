'use client';

import { useState, useEffect, useRef } from 'react';
import { THEME } from '@/app/utils/constants';

export default function InteractiveReactor() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate angle from center to mouse
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Normalize to rotation values (max 15 degrees)
      const rotateY = (deltaX / (rect.width / 2)) * 15;
      const rotateX = -(deltaY / (rect.height / 2)) * 15;

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
          color: THEME.colors.darkSteel,
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'text-shadow 0.1s ease-out, transform 0.05s ease-out',
          textShadow: `
            ${Math.cos((rotation.y * Math.PI) / 180) * 20}px ${Math.sin((rotation.x * Math.PI) / 180) * 20}px 30px rgba(0, 0, 0, 0.3),
            ${Math.cos((rotation.y * Math.PI) / 180) * 10}px ${Math.sin((rotation.x * Math.PI) / 180) * 10}px 15px rgba(255, 140, 0, 0.2),
            0 0 40px rgba(255, 140, 0, 0.1)
          `,
          willChange: 'transform, text-shadow',
        }}
      >
        REACTOR
      </div>
    </div>
  );
}
