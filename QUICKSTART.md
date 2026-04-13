# REACTOR - Quick Start Guide

## 🎯 What You Need to Do

### Step 1: Firebase Setup (5 minutes)
1. Go to https://console.firebase.google.com
2. Click "Add Project" → "REACTOR"
3. Enable these:
   - **Authentication**: Email/Password
   - **Firestore Database**: Production mode

### Step 2: Get Firebase Credentials (2 minutes)
1. In Firebase Console → Project Settings (gear icon) → General
2. Scroll to "Your apps" section
3. Copy the config object

### Step 3: Configure Environment (2 minutes)
1. In the `reactor` folder, find or create `.env.local`
2. Add your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Run Locally (2 minutes)
```bash
cd reactor
npm install  # Only needed first time
npm run dev
```

Open: http://localhost:3000

### Step 5: Test It Out (5 minutes)
1. Go to `/signup` → Create account
2. Verify email (check spam folder)
3. Go to `/login` → Login
4. Dashboard → Create your first idea!

### Step 6: Deploy to Vercel (5 minutes)
```bash
npm i -g vercel
vercel
```

When prompted:
- Select your project directory
- Add your .env.local variables
- Vercel will build and deploy

**You'll get a live URL to share with friends!**

---

## 🔑 Firebase Credentials

You need these from your Firebase project:

| Variable | Where to Find |
|----------|--------------|
| `API_KEY` | Project Settings → Web API Key |
| `AUTH_DOMAIN` | Project Settings → Auth Domain |
| `PROJECT_ID` | Project Settings → Project ID |
| `STORAGE_BUCKET` | Project Settings → Storage Bucket |
| `MESSAGING_SENDER_ID` | Project Settings → Sender ID |
| `APP_ID` | Project Settings → App ID |

## 🚀 That's It!

Your REACTOR instance is now live. Share the Vercel URL with your friends and start collaborating on startup ideas!

### Default Pages
- Home: `/`
- Sign Up: `/signup`
- Login: `/login`
- Dashboard: `/dashboard` (login required)

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Firebase not initialized" | Check .env.local has correct credentials |
| Signup fails | Check email format, password meets requirements |
| Login stuck | Check browser console for errors |
| Ideas not showing | Make sure you're logged in |

---

**Questions?** Check the full README.md in the reactor folder!
