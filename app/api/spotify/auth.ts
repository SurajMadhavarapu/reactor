import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  // Generate state for CSRF protection
  const state = crypto.randomBytes(16).toString('hex');
  
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const scopes = ['user-read-currently-playing', 'user-read-playback-state'];

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId || '');
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri || '');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('state', state);

  // Store state in cookie for verification in callback
  const response = NextResponse.redirect(authUrl);
  response.cookies.set('spotify_auth_state', state, {
    httpOnly: true,
    maxAge: 600, // 10 minutes
    sameSite: 'lax',
  });

  return response;
}
