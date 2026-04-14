import { NextResponse } from 'next/server';

async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

export async function GET(request) {
  let accessToken = request.cookies.get('spotify_access_token')?.value;
  const refreshToken = request.cookies.get('spotify_refresh_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { isPlaying: false, currentTrack: null, authenticated: false },
      { status: 200 }
    );
  }

  try {
    let response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('Spotify currently-playing status:', response.status);

    if (response.status === 401 && refreshToken) {
      console.log('Token expired, refreshing...');
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        accessToken = newAccessToken;
        response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Spotify currently-playing status after refresh:', response.status);
      }
    }

    if (response.status === 204 || !response.ok) {
      console.log('Spotify returned 204 or error - no active playback');
      return NextResponse.json(
        { isPlaying: false, currentTrack: null, authenticated: true },
        { status: 200 }
      );
    }

    const data = await response.json();
    console.log('Spotify data:', { is_playing: data.is_playing, has_item: !!data.item });

    if (!data.item) {
      console.log('No item in Spotify response');
      return NextResponse.json(
        { isPlaying: false, currentTrack: null, authenticated: true },
        { status: 200 }
      );
    }

    const currentTrack = {
      title: data.item.name,
      artist: data.item.artists.map(a => a.name).join(', '),
      albumArt: data.item.album.images[0]?.url || null,
      songUrl: data.item.external_urls.spotify,
      isPlaying: data.is_playing,
      progressMs: data.progress_ms,
      durationMs: data.item.duration_ms,
    };

    console.log('Returning track:', { title: currentTrack.title, isPlaying: data.is_playing });

    const res = NextResponse.json({
      isPlaying: data.is_playing,
      currentTrack,
      authenticated: true,
    });

    if (accessToken) {
      res.cookies.set('spotify_access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600,
      });
    }

    return res;
  } catch (error) {
    console.error('Now playing error:', error);
    return NextResponse.json(
      { isPlaying: false, currentTrack: null, authenticated: false },
      { status: 200 }
    );
  }
}
