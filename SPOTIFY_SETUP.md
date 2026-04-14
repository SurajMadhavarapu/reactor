# Spotify Now Playing Widget Setup Guide

## What's New

The app now includes a **Spotify Now Playing widget** that displays the currently playing track with:
- ✅ Track name, artist, and album art
- ✅ Animated 4-bar equalizer when music is playing
- ✅ Progress bar with time display
- ✅ Auto-refresh every 5 seconds
- ✅ Real-time track updates
- ✅ "❤️ PULSE - VIBE" section for mood selection

## Setup Steps

### 1. Create a Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (create one if needed)
3. Click "Create an App"
4. Accept terms and create the app
5. Accept the Spotify API Terms
6. You'll see your app dashboard with:
   - **Client ID**
   - **Client Secret** (Keep this secret!)

### 2. Configure Redirect URI

In your Spotify app settings:
1. Click "Edit Settings"
2. Scroll to "Redirect URIs"
3. Add your callback URL:
   - **Development**: `http://localhost:3000/api/auth/spotify/callback`
   - **Production**: `https://yourdomain.com/api/auth/spotify/callback`
4. Click "Save"

### 3. Update Environment Variables

In `.env.local`, fill in your Spotify credentials:

```bash
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/spotify/callback
```

### 4. Restart Development Server

```bash
npm run dev
```

## How It Works

### OAuth Flow

1. **User clicks "Connect Spotify"** → Redirects to `/api/auth/spotify`
2. **Auth endpoint** → Generates CSRF state, redirects to Spotify login
3. **Spotify login** → User authorizes the app
4. **Callback** → Exchange authorization code for access & refresh tokens
5. **Tokens stored** → HTTP-only cookies (secure, not accessible from JS)
6. **Now Playing fetches** → Requests current track from Spotify API
7. **Auto-refresh** → When token expires, uses refresh token to get new access token

### Token Refresh

- Access tokens expire after ~1 hour
- When API returns 401, the now-playing endpoint automatically:
  1. Uses refresh token to get new access token
  2. Stores new token in cookie
  3. Retries the request
  4. No manual action needed from user

### Real-Time Updates

- NowPlaying component polls `/api/now-playing` every 5 seconds
- Displays:
  - Current track name and artist
  - Album art
  - Progress bar (current time / total duration)
  - Animated equalizer (4 bars bouncing when playing)
  - Link to open track on Spotify

## Component Usage

The `<NowPlaying />` component is already integrated into the idea detail page. To use elsewhere:

```tsx
import { NowPlaying } from '@/app/components/NowPlaying';

export function MyComponent() {
  return <NowPlaying />;
}
```

## Troubleshooting

### "Connect Spotify" button not working
- Check that `NEXT_PUBLIC_SPOTIFY_CLIENT_ID` is set in `.env.local`
- Verify Spotify app exists in [Developer Dashboard](https://developer.spotify.com/dashboard)
- Clear browser cookies and try again

### No track showing after connecting
- Ensure music is currently playing on your Spotify account
- Check that access token was saved (look in browser DevTools → Application → Cookies)
- Verify Spotify app has "User Read Currently Playing" permission (granted during OAuth)

### Token errors (401)
- First login might take 1-2 seconds to fetch token
- If persistent, refresh the page
- Check Spotify API status at [status.spotify.com](https://status.spotify.com)

### Private session mode
- Spotify private sessions don't expose current track via API
- Switch to normal session to see now playing

## Permissions Used

The app requests these Spotify scopes:
- `user-read-currently-playing` - See what you're listening to
- `user-read-private` - Access your profile info
- `user-read-email` - See your email

That's it! No access to modify playlists or private data.

## Security Notes

- ✅ Tokens stored in HTTP-only cookies (can't be stolen via XSS)
- ✅ Client secret never exposed to frontend (handled server-side)
- ✅ CSRF protection with state parameter
- ✅ All OAuth requests to Spotify use HTTPS
- ✅ No sensitive data stored in browser localStorage

## Testing

1. **Start the app**: `npm run dev`
2. **Go to an idea** (`/ideas/[id]`)
3. **Look for "❤️ PULSE" section** on the right sidebar
4. **Click "Connect Spotify"** above the Pulse mood selector
5. **Authorize** the app (first time only)
6. **See your current track** with animated equalizer

## Production Deployment

Before deploying to production:

1. Create a Spotify app for your production domain
2. Update `.env.local` with production credentials:
   ```bash
   NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/auth/spotify/callback
   ```
3. Redeploy the app
4. Test the OAuth flow on production domain

## Files Modified

- `app/ideas/[id]/page.tsx` - Added NowPlaying component import and integration
- `.env.local` - Added Spotify configuration variables

## Files Created

- `app/api/spotify/auth.ts` - OAuth redirect endpoint
- `app/api/spotify/callback.ts` - Token exchange endpoint
- `app/api/spotify/now-playing.ts` - Current track fetching
- `app/components/NowPlaying.tsx` - React component with animated equalizer

---

**That's it!** Your Spotify integration is ready. 🎵
