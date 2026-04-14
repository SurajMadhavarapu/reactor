import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

  // Validate required environment variables
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        error: 'Missing Spotify configuration',
        details: {
          clientId: clientId ? 'set' : 'missing',
          redirectUri: redirectUri ? 'set' : 'missing',
        },
      },
      { status: 500 }
    );
  }

  const state = crypto.randomBytes(16).toString('hex');

  const scopes = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-top-read',
    'user-read-recently-played',
  ];

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('state', state);

  const response = NextResponse.redirect(authUrl);
  response.cookies.set('spotify_auth_state', state, {
    httpOnly: true,
    maxAge: 600,
    sameSite: 'lax',
  });

  return response;
}
