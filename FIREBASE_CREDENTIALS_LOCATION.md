# Firebase Credentials - Visual Guide

## Your Firebase Config Location

### Step 1: Go to Firebase Console
https://console.firebase.google.com

### Step 2: Find Project Settings
**Top Left** → Click your project name → **⚙️ Settings** (gear icon)

### Step 3: Navigate to General Tab
Click the **"General"** tab (should be default)

### Step 4: Scroll Down to "Your Apps"
Look for this section:

```
YOUR APPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 
 [</> React] reactor
 ↑
 Click this Web icon to see config
```

### Step 5: Click the Web App (</> icon)
You'll see a box with:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDx...",              ← Copy this
  authDomain: "reactor-abc.firebaseapp.com",  ← Copy this
  projectId: "reactor-abc",            ← Copy this
  storageBucket: "reactor-abc.appspot.com",  ← Copy this
  messagingSenderId: "123456789",     ← Copy this
  appId: "1:123:web:abc123"           ← Copy this
};
```

---

## Exact Mapping to .env.local

```
Firebase Config              →  .env.local Variable Name
─────────────────────────────────────────────────────────
apiKey                      →  NEXT_PUBLIC_FIREBASE_API_KEY
authDomain                  →  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
projectId                   →  NEXT_PUBLIC_FIREBASE_PROJECT_ID
storageBucket               →  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
messagingSenderId           →  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
appId                       →  NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## Example .env.local (REAL VALUES)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDx1234567890abcdefghijklmnop
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=reactor-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=reactor-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=reactor-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

---

## Copy-Paste Instructions

1. **In Firebase Console**: Select all (Ctrl+A) in the firebaseConfig box
2. **Copy** the values one by one
3. **In .env.local**: Replace the placeholder text with real values
4. **Save** the file
5. **Done!** ✅

---

## Platform Selection

**DO THIS:**

When you see the "Add app to your project" screen:

```
┌─────────────────────────────────────┐
│  Choose a platform to get started  │
│                                      │
│  [iOS] [Android] [Web] [Unity]     │
│                           ↑         │
│                       CLICK HERE    │
└─────────────────────────────────────┘
```

Click **WEB (</> icon)** ✅

---

## Common Places to Find Credentials

| Location | How to Get There |
|----------|-----------------|
| **Firebase Console** | console.firebase.google.com |
| **Project Settings** | Top left → Project name → ⚙️ |
| **Web Config** | Settings → General → Scroll to "Your Apps" → Click </> icon |
| **API Key** | The long string starting with "AIza..." |
| **Project ID** | Short name like "reactor-abc123" |

---

## Verification Checklist

✅ You created a Firebase project named "REACTOR"
✅ You registered a Web app in that project
✅ You have 6 values from firebaseConfig
✅ You pasted them into .env.local
✅ You enabled Email/Password authentication
✅ You created a Firestore database

**If all checked ✅, you're ready for Vercel!**

---

## Next: Vercel Deployment

Once .env.local is filled:

```bash
git push -u origin main
```

Then go to Vercel and:
1. Add those same 6 values as environment variables
2. Click Deploy
3. Get your live URL

---

**Need help?** Read FIREBASE_SETUP.md in the reactor folder for full step-by-step guide.
