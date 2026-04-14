'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '@/app/utils/constants';

interface Track {
  name: string;
  artist: string;
  album: string;
  albumArt?: string;
  durationMs: number;
  progressMs: number;
  isPlaying: boolean;
  spotifyUrl: string;
}

interface NowPlayingData {
  isPlaying: boolean;
  currentTrack: Track | null;
}

const Equalizer = ({ isPlaying }: { isPlaying: boolean }) => {
  const bars = [0, 1, 2, 3];
  
  return (
    <div className="flex items-end gap-1 h-12 justify-center">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: isPlaying
              ? THEME.gradients.button
              : `${THEME.colors.gold}40`,
            opacity: isPlaying ? 1 : 0.5,
            border: `2px solid ${THEME.colors.gold}`,
          }}
          animate={
            isPlaying
              ? {
                  height: ['20px', '40px', '28px', '35px', '20px'],
                }
              : {
                  height: '20px',
                }
          }
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

const ProgressBar = ({ progress, duration }: { progress: number; duration: number }) => {
  const percent = (progress / duration) * 100;
  const minutes = Math.floor(progress / 60000);
  const seconds = Math.floor((progress % 60000) / 1000);
  const durationMinutes = Math.floor(duration / 60000);
  const durationSeconds = Math.floor((duration % 60000) / 1000);

  return (
    <div className="space-y-2">
      <div
        className="h-1 bg-opacity-20 rounded-full overflow-hidden"
        style={{
          background: `${THEME.colors.gold}40`,
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: THEME.gradients.progressGradient,
            width: `${percent}%`,
          }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="flex justify-between text-xs" style={{ color: THEME.colors.slate }}>
        <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        <span>
          {String(durationMinutes).padStart(2, '0')}:{String(durationSeconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export const NowPlaying = () => {
  const [nowPlayingData, setNowPlayingData] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/spotify/now-playing');
        if (response.ok) {
          const data = await response.json();
          setNowPlayingData(data);
        } else if (response.status === 401) {
          setError('Not connected to Spotify');
        }
      } catch (err) {
        setError('Failed to fetch now playing');
        console.error('Error fetching now playing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();

    // Poll every 5 seconds
    const interval = setInterval(fetchNowPlaying, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className="p-6 rounded-xl backdrop-blur-sm"
        style={{
          background: THEME.gradients.card,
          border: `2px solid ${THEME.colors.gold}`,
          boxShadow: THEME.shadows.goldShadow,
        }}
      >
        <div
          className="h-20 rounded flex items-center justify-center"
          style={{ background: `${THEME.colors.gold}20` }}
        >
          <p style={{ color: THEME.colors.navy }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6 rounded-xl backdrop-blur-sm"
        style={{
          background: THEME.gradients.card,
          border: `2px solid ${THEME.colors.gold}`,
          boxShadow: THEME.shadows.goldShadow,
        }}
      >
        <h3 style={{ color: THEME.colors.navy }} className="text-sm font-serif font-bold mb-4">
          ❤️ PULSE
        </h3>
        <div className="flex flex-col items-center justify-center gap-3">
          <Equalizer isPlaying={false} />
          <p style={{ color: THEME.colors.charcoal }} className="text-sm">
            {error}
          </p>
          <a
            href="/api/spotify/auth"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-center transition"
            style={{
              background: THEME.gradients.button,
              color: THEME.colors.cream,
            }}
          >
            Connect Spotify
          </a>
        </div>
      </div>
    );
  }

  const track = nowPlayingData?.currentTrack;
  const isPlaying = nowPlayingData?.isPlaying;

  return (
    <div
      className="p-6 rounded-xl backdrop-blur-sm"
      style={{
        background: THEME.gradients.card,
        border: `2px solid ${THEME.colors.gold}`,
        boxShadow: THEME.shadows.goldShadow,
      }}
    >
      <h3 style={{ color: THEME.colors.navy }} className="text-sm font-serif font-bold mb-4">
        ❤️ PULSE
      </h3>

      {!isPlaying || !track ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <Equalizer isPlaying={false} />
          <p style={{ color: THEME.colors.charcoal }} className="text-sm">
            Not playing
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Album Art */}
          {track.albumArt && (
            <motion.img
              src={track.albumArt}
              alt={track.album}
              className="w-full rounded-lg mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}

          {/* Equalizer */}
          <Equalizer isPlaying={true} />

          {/* Track Info */}
          <div className="space-y-2">
            <a
              href={track.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition"
            >
              <h4
                style={{ color: THEME.colors.navy }}
                className="text-sm font-serif font-bold truncate"
              >
                {track.name}
              </h4>
            </a>
            <p style={{ color: THEME.colors.charcoal }} className="text-xs opacity-80 truncate">
              {track.artist}
            </p>
            <p style={{ color: THEME.colors.slate }} className="text-xs opacity-70 truncate">
              {track.album}
            </p>
          </div>

          {/* Progress Bar */}
          <ProgressBar progress={track.progressMs} duration={track.durationMs} />

          {/* Spotify Badge */}
          <div className="pt-2 border-t" style={{ borderColor: `${THEME.colors.gold}40` }}>
            <p style={{ color: THEME.colors.slate }} className="text-xs text-center">
              🎵 Playing on Spotify
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
