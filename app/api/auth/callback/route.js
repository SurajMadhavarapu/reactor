import { NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const storedState = request.cookies.get('spotify_auth_state')?.value;
  const error = searchParams.get('error');

  if (!state || state !== storedState) {
    return NextResponse.json(
      { error: 'State mismatch - authorization failed' },
      { status: 400 }
    );
  }

  if (error) {
    return NextResponse.json(
      { error: `Authorization failed: ${error}` },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: 'No authorization code received' },
      { status: 400 }
    );
  }

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to exchange token' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    // Get return URL from cookie (set by Tuned component)
    // Fallback to dashboard if cookie not found
    const returnUrlCookie = request.cookies.get('spotify_return_url')?.value;
    const returnUrl = returnUrlCookie || '/dashboard';
    
    const response = NextResponse.redirect(new URL(returnUrl, request.url));
    
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
    });

    if (tokenData.refresh_token) {
      response.cookies.set('spotify_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    response.cookies.delete('spotify_auth_state');
    response.cookies.delete('spotify_return_url');

    return response;
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
