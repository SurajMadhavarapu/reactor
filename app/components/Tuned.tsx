'use client';

import { useEffect, useState } from 'react';
import { THEME } from '@/app/utils/constants';

interface CurrentTrack {
  title: string;
  artist: string;
  albumArt: string | null;
  songUrl: string;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
}

interface NowPlayingData {
  isPlaying: boolean;
  currentTrack: CurrentTrack | null;
}

const WaveformEqualizer = ({ isPlaying }: { isPlaying: boolean }) => {
  return (
    <div className="flex items-end justify-center gap-1 h-12">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: isPlaying
              ? THEME.gradients.button
              : `${THEME.colors.gold}40`,
            opacity: isPlaying ? 1 : 0.5,
            border: `2px solid ${THEME.colors.gold}`,
            height: isPlaying ? '30px' : '20px',
            animation: isPlaying
              ? `wave-${i} 0.6s ease-in-out infinite`
              : 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes wave-0 {
          0%, 100% { height: 20px; }
          50% { height: 40px; }
        }
        @keyframes wave-1 {
          0%, 100% { height: 25px; }
          50% { height: 38px; }
        }
        @keyframes wave-2 {
          0%, 100% { height: 20px; }
          50% { height: 42px; }
        }
        @keyframes wave-3 {
          0%, 100% { height: 23px; }
          50% { height: 36px; }
        }
      `}</style>
    </div>
  );
};

export function Tuned() {
  const [track, setTrack] = useState<NowPlayingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const response = await fetch('/api/now-playing');
        const data = await response.json();
        
        if (data.error) {
          setError(data.error);
          setIsAuthenticated(false);
        } else if (data.currentTrack || data.isPlaying) {
          setIsAuthenticated(true);
          setError(null);
        } else if (!data.error) {
          // No error but no current track - might just not be playing
          setIsAuthenticated(true);
          setError(null);
        }
        
        setTrack(data);
      } catch (err) {
        console.error('Error fetching now playing:', err);
        setError('Failed to fetch track data');
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000);
    
    // Refetch immediately when page becomes visible (e.g., after OAuth redirect)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchNowPlaying();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleConnect = () => {
    // Store the current URL so callback can redirect back
    document.cookie = `spotify_return_url=${window.location.href}; path=/; max-age=600`;
    window.location.href = '/api/auth/spotify';
  };

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
        <div className="animate-pulse h-24" />
      </div>
    );
  }

  if (!isAuthenticated || !track?.currentTrack) {
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
          TUNED
        </h3>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: `${THEME.colors.error}20`, border: `1px solid ${THEME.colors.error}` }}>
            <p style={{ color: THEME.colors.error }} className="text-xs font-medium">
              {error === 'Missing Spotify configuration'
                ? 'Spotify not configured. Check environment variables.'
                : error}
            </p>
          </div>
        )}
        
        <p style={{ color: THEME.colors.charcoal }} className="text-xs mb-4 opacity-80">
          Connect your Spotify to see what you're vibing to
        </p>
        <button
          onClick={handleConnect}
          className="w-full py-2 px-3 rounded-lg text-sm font-medium transition"
          style={{
            background: THEME.gradients.button,
            color: THEME.colors.cream,
            border: `1px solid ${THEME.colors.gold}`,
          }}
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  const { currentTrack, isPlaying } = track;

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
        TUNED
      </h3>

      {isPlaying ? (
        <div className="space-y-4">
          {currentTrack.albumArt && (
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              className="w-full rounded-lg"
            />
          )}
          
          <WaveformEqualizer isPlaying={isPlaying} />
          
          <div className="space-y-1">
            <p
              style={{ color: THEME.colors.navy }}
              className="text-sm font-serif font-bold truncate"
            >
              {currentTrack.title}
            </p>
            <p
              style={{ color: THEME.colors.slate }}
              className="text-xs truncate"
            >
              {currentTrack.artist}
            </p>
          </div>
          
          <a
            href={currentTrack.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs font-medium transition hover:opacity-80"
            style={{ color: THEME.colors.gold }}
          >
            Open on Spotify →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <WaveformEqualizer isPlaying={false} />
          <p
            style={{ color: THEME.colors.slate }}
            className="text-xs text-center opacity-60"
          >
            Not playing
          </p>
        </div>
      )}
    </div>
  );
}
