# Fix Google Sign-Up Error: auth/unauthorized-domain

## Problem
When clicking "Sign up with Google" button, you get:
```
Firebase: Error (auth/unauthorized-domain)
```

## Root Cause
Your Vercel domain is not in Firebase's authorized domains list.

## Solution (5 minutes)

### Step 1: Identify Your Domain
Your Vercel domain is:
```
reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app
```

### Step 2: Open Firebase Console
1. Go to: https://console.firebase.google.com
2. Click on your **REACTOR** project
3. You should see project overview

### Step 3: Go to Authentication Settings
1. Click **Authentication** in the left sidebar
2. Click the **Settings** tab (or gear icon ⚙️ at top)
3. Scroll down to find **"Authorized domains"** section

### Step 4: Add Your Vercel Domain
1. Click **Add domain**
2. Enter: `reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app`
3. Click **Add**
4. You should see it in the list with a green checkmark

### Step 5: Add localhost (Optional, for local development)
1. Click **Add domain** again
2. Enter: `localhost:3000`
3. Click **Add**

### Step 6: Wait for Propagation
Firebase takes 5-10 minutes to update. Wait a bit.

### Step 7: Test It
1. Clear your browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete on Mac)
2. Go to your Vercel app: https://reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app
3. Click **Sign up**
4. Click **Sign up with Google** button
5. Complete Google auth flow
6. Should work now! ✅

---

## If It Still Doesn't Work

### Check 1: Verify Domain Was Added
- Go back to Firebase Console → Authentication → Settings
- Scroll to "Authorized domains"
- Make sure you see:
  - ✅ `reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app`

### Check 2: Correct Domain?
What URL are you accessing? Check your browser address bar:
- Is it `reactor-k5zrg4s17-...`? → Add that domain
- Is it something else? → Add that domain instead

### Check 3: Hard Refresh Browser
- Press: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac)
- Clears cache completely
- Try Google sign-up again

### Check 4: Firebase Console Changes
Sometimes Firebase Console takes time:
1. Wait 10 minutes
2. Hard refresh your app
3. Try again

### Check 5: Google OAuth Provider Enabled?
Make sure Google provider is actually enabled:

1. Firebase Console → Authentication → Providers
2. Look for **Google**
3. Should have a blue toggle (enabled)
4. If disabled, click it to enable

---

## Complete Screenshot Guide

### Location 1: Providers List
```
Firebase Console
  ├─ Authentication (click here)
  │  ├─ Providers (you should see Google with blue toggle)
  │  └─ Settings (gear icon)
  └─ Settings (gear icon) ← Click here
```

### Location 2: Authorized Domains Section
```
In Settings, scroll down to:
───────────────────────────────────
   Authorized domains
───────────────────────────────────
   [Add domain] button

   ✓ reactor-k5zrg4s17-...vercel.app
   ✓ localhost:3000
```

---

## Exact Steps (Copy-Paste Ready)

1. **Go to Firebase:**
   ```
   https://console.firebase.google.com
   ```

2. **Select project:**
   - Click "REACTOR" project name

3. **Open Auth Settings:**
   - Left sidebar → Authentication
   - Click gear icon (Settings) at top right

4. **Add domain:**
   - Scroll down to "Authorized domains"
   - Click "Add domain"
   - Paste: `reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app`
   - Click "Add"

5. **Add localhost (optional):**
   - Click "Add domain" again
   - Paste: `localhost:3000`
   - Click "Add"

6. **Wait 5-10 minutes**

7. **Test:**
   - Go to: https://reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app/signup
   - Click "Sign up with Google"
   - Should work! ✅

---

## Why This Happens

Firebase's OAuth flow redirects to Google's servers, then back to your app. Google needs to verify the redirect URL is legitimate (your domain). If the domain isn't in the authorized list, Google blocks the redirect.

Adding your domain tells Google: "Yes, this domain is allowed to use my OAuth credentials."

---

## Alternative: Custom Domain

If you have a custom domain (e.g., `reactor.com`):

1. Add that custom domain to Authorized domains instead
2. Point your custom domain to Vercel in your DNS settings
3. Configure custom domain in Vercel project settings
4. Verify SSL certificate is issued

But for now, use the Vercel domain.

---

## Troubleshooting Table

| Error | Solution |
|-------|----------|
| `auth/unauthorized-domain` | Add domain to Firebase authorized list |
| Google button not appearing | Check if Google provider is enabled |
| Redirects to error page | Wait 10 min, clear cache, try again |
| Stuck on Google login page | Check internet connection, try incognito mode |
| Works on localhost, not on prod | Add production domain to authorized list |

---

## Common Mistakes

❌ **Wrong:** Adding just `vercel.app` (too broad)
✅ **Right:** Adding full domain `reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app`

❌ **Wrong:** Adding `http://` or `https://` prefix
✅ **Right:** Just the domain name without protocol

❌ **Wrong:** Adding with trailing `/`
✅ **Right:** No trailing slash

---

## Verify It Worked

After completing steps above:

```
Expected behavior:
1. Click "Sign up with Google"
2. Google login popup opens
3. Sign in with Google account
4. Redirects back to your app
5. Account created ✅

What was breaking before:
1. Click "Sign up with Google"
2. Google popup opens
3. You sign in
4. Google tries to redirect...
5. Firebase blocks it (unauthorized-domain)
6. Error appears ❌
```

---

## Need Help?

If still not working after all steps:

1. **Check your domain is correct**
   - Copy URL from browser address bar
   - Make sure it matches what you added to Firebase

2. **Check Google provider is enabled**
   - Firebase Console → Authentication → Providers
   - Google should have blue toggle

3. **Try incognito window**
   - Open in private/incognito mode
   - Clears all cache
   - Tries fresh

4. **Check Firebase project**
   - Make sure you're in the right project
   - Project name should be "REACTOR"

---

## Success! 🎉

Once fixed, you can:
- ✅ Sign up with Google
- ✅ Log in with Google
- ✅ Create ideas
- ✅ Comment and collaborate
- ✅ Share startup ideas with friends

Enjoy building REACTOR!

---

**Time to fix:** 5 minutes  
**Difficulty:** Easy  
**Impact:** Google authentication working
