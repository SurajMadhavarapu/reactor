'use client';

import { useEffect, useRef } from 'react';

interface ArcReactorBackgroundProps {
  opacity?: number;
}

export default function ArcReactorBackground({ opacity = 0.2 }: ArcReactorBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.play();
      });
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', () => {});
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
        style={{
          opacity,
          filter: 'blur(2px)',
        }}
      >
        <source
          src="/videos/tony stark chit chatting with jarvis (English subtitles) - Iron Man 2 (2010).mp4"
          type="video/mp4"
        />
        <p>Your browser does not support the video tag.</p>
      </video>

      {/* Subtle gradient overlay for enhanced text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(245, 241, 232, 0.3) 0%, rgba(232, 228, 220, 0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
