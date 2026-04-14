# 🔥 Firebase Setup - Complete Step-by-Step Guide

## ⚠️ CRITICAL: If Signup Is Hanging

If the signup form is stuck on "Creating Account..." for more than 10 seconds:
1. Your Firebase credentials in `.env.local` are placeholder values (e.g., `your_api_key_here`)
2. Follow the steps below to get your real credentials
3. Update `.env.local` with actual values
4. Restart `npm run dev`

## ✅ YES! Select Web Platform

Here's exactly what to do:

---

## Step 1: Go to Firebase Console
https://console.firebase.google.com

Click **"+ Create a project"**

---

## Step 2: Create Project
1. **Project name**: `REACTOR`
2. Click **"Continue"**
3. **Google Analytics**: Uncheck (optional for startup)
4. Click **"Create project"**

Wait 30 seconds for creation...

---

## Step 3: Add Web App
Once project is created:

1. Look for **</> (Web icon)** on the dashboard
2. Click it
3. Enter app name: `reactor`
4. **Check ✅** "Also set up Firebase Hosting"
5. Click **"Register app"**

---

## Step 4: Copy Your Credentials
After registration, you'll see this screen with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**COPY ALL 6 VALUES** ✅

---

## Step 5: Paste into .env.local

Open: `C:\Users\venka\OneDrive\Desktop\Startup Ideas\reactor\.env.local`

Replace with your values:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## Step 6: Enable Authentication
Back in Firebase Console:

1. Left menu → **"Authentication"**
2. Click **"Get started"**
3. Select **"Email/Password"**
4. Toggle **"Enable"** ✅
5. Click **"Save"**

---

## Step 7: Create Firestore Database
1. Left menu → **"Firestore Database"**
2. Click **"Create Database"**
3. Select **"Start in production mode"**
4. Choose region: **`us-central1`** (or closest to you)
5. Click **"Create"**

---

## That's It! ✅

You now have:
- ✅ Firebase project created
- ✅ Web app registered
- ✅ 6 credentials for .env.local
- ✅ Authentication enabled
- ✅ Firestore database ready

---

## 🎯 Next: Deploy to Vercel

Once you have all 6 values in `.env.local`:

1. Go to https://vercel.com
2. Create account (sign up with GitHub)
3. Import your "reactor" GitHub repo
4. Add those 6 Firebase values as environment variables
5. Click Deploy

---

## 📍 Where to Find Each Value

| Value | Where to Find |
|-------|--------------|
| `apiKey` | Firebase console → Project Settings → Web API Key |
| `authDomain` | Firebase console → Project Settings → Auth domain |
| `projectId` | Firebase console → Project Settings → Project ID |
| `storageBucket` | Firebase console → Project Settings → Storage bucket |
| `messagingSenderId` | Firebase console → Project Settings → Sender ID |
| `appId` | Firebase console → Project Settings → App ID |

---

## ❓ FAQ

**Q: Which platform?**
A: **WEB** - since REACTOR is a web app ✅

**Q: Do I need Google Analytics?**
A: No, uncheck it to keep it simple

**Q: What region for Firestore?**
A: `us-central1` is fine (or pick closest to your location)

**Q: Do I need to do anything else in Firebase?**
A: No! Just enable Auth + create Firestore. We'll handle the rest.

**Q: Is my data safe?**
A: Yes! Firebase handles encryption. Security rules are built into REACTOR.

---

## 🚨 Important

- ✅ `.env.local` is in `.gitignore` (secrets never uploaded)
- ✅ Keep your values private
- ✅ Don't share .env.local file
- ✅ Vercel will keep them secure

---

## Stuck? 

If you can't find something:
1. Go to Firebase Console
2. Top left → Your project name → Settings ⚙️
3. Click "General" tab
4. Scroll down to "Your apps"
5. Find the Web app
6. Click the code icon </>
7. All 6 values are there!

---

**Once you paste the 6 values into .env.local, you're done with Firebase setup!** 🎉
