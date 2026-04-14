# Spotify Setup Guide - TUNED Component

## The Error You're Seeing

If you see **"client_id: Invalid"**, it means the Spotify credentials are not configured in your `.env.local` file.

## Step-by-Step Setup

### 1. Create a Spotify Developer App

1. Go to **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)**
2. Log in with your Spotify account (create one if you don't have it)
3. Click **"Create an App"**
4. Accept the terms and create the app
5. You'll see your app credentials:
   - **Client ID** (copy this)
   - **Client Secret** (copy this, keep it secret!)

### 2. Get Your Credentials

After creating the app, you'll see:
```
Client ID: something_like_abc123def456ghi789jkl
Client Secret: something_like_xyz789uvw456rst123opq
```

### 3. Configure Redirect URI in Spotify Dashboard

1. In your Spotify app settings, click **"Edit Settings"**
2. Find **"Redirect URIs"**
3. Add this URL:
   - **Development**: `http://localhost:3000/api/auth/callback`
   - **Production**: `https://yourdomain.com/api/auth/callback`
4. Click **"Save"** (or **"Add"** if it's a new field)

### 4. Update `.env.local`

Open `.env.local` in the project root and update these lines:

```bash
# Replace 'your_spotify_client_id' with your actual Client ID
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=abc123def456ghi789jkl

# Replace 'your_spotify_client_secret' with your actual Client Secret
SPOTIFY_CLIENT_SECRET=xyz789uvw456rst123opq

# This should already be correct, but verify it matches your Redirect URI
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

**Example of filled-in .env.local:**
```bash
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=12a3b4c5d6e7f8g9h0i1j2k3l4
SPOTIFY_CLIENT_SECRET=secretabc123xyz789def456uvw
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### 5. Restart Your Dev Server

After updating `.env.local`, restart your development server:

```bash
npm run dev
```

The dev server needs to restart to pick up the new environment variables.

### 6. Test the Integration

1. Go to any idea detail page: `http://localhost:3000/ideas/[id]`
2. Look for the **"TUNED"** section in the right sidebar
3. Click **"Connect Spotify"**
4. You'll be redirected to Spotify login
5. Authorize the app
6. You'll be redirected back and should see your current track!

## Troubleshooting

### "client_id: Invalid"
- ✗ You have the placeholder value in `.env.local`
- ✓ Replace with your real Client ID from Spotify dashboard
- ✓ Restart dev server (`npm run dev`)

### "Redirect URI mismatch"
- ✗ The redirect URI in `.env.local` doesn't match what's in Spotify dashboard
- ✓ Go to Spotify dashboard → App settings → Edit Settings
- ✓ Make sure `http://localhost:3000/api/auth/callback` is listed under Redirect URIs
- ✓ Update `.env.local` if you changed it

### Nothing shows in TUNED section
- ✗ App not properly configured
- ✓ Check browser console for errors (F12 → Console)
- ✓ Check that Spotify is playing a track
- ✓ Check that cookies are being set (F12 → Application → Cookies)

### "Connect Spotify" button doesn't work
- ✗ Environment variables not loaded
- ✓ Restart dev server
- ✓ Check that `.env.local` is in the project root
- ✓ Make sure you didn't accidentally add quotes around values

### Private Session Mode
- Spotify doesn't show currently playing track in private sessions
- Switch to normal session in Spotify to see your track

## What the App Requests

When you click "Connect Spotify", we ask for permission to:
- **user-read-currently-playing** - See what you're listening to right now
- **user-read-playback-state** - Check if music is playing
- **user-top-read** - (Available for future features)
- **user-read-recently-played** - (Available for future features)

We only use the first two scopes. That's it!

## Security Notes

- ✅ Your Client Secret is **never** sent to the browser
- ✅ Access tokens are stored in HTTP-only cookies (can't be stolen via JavaScript)
- ✅ We include CSRF protection with state tokens
- ✅ All requests to Spotify use HTTPS

## For Production Deployment

Before deploying to production:

1. Create a **new** Spotify app (or use the same one, but add a new redirect URI)
2. Update `.env.local` (or better, use environment variables in your hosting):
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_production_client_id
   SPOTIFY_CLIENT_SECRET=your_production_client_secret
   SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/auth/callback
   ```
3. Add `https://yourdomain.com/api/auth/callback` to your Spotify app's Redirect URIs
4. Deploy!

## Files You Need to Know

- **`app/api/auth/spotify/route.js`** - Initiates OAuth flow
- **`app/api/auth/callback/route.js`** - Handles Spotify callback
- **`app/api/now-playing/route.js`** - Fetches current track
- **`app/components/Tuned.tsx`** - The UI component
- **`.env.local`** - Your credentials (NEVER commit this!)

---

**Still having issues?** Check the browser console (F12) for error messages, and share the exact error with the development team.
