# Vercel Deployment Troubleshooting - GitHub User Not Found Error

## Error Description
```
GitHub User Not Found
copilot@github.com
No matching user
Unavailable
```

## Likely Causes

### 1. **Firebase Service Account Email Issue**
The `FIREBASE_CLIENT_EMAIL` environment variable in Vercel might be:
- Incorrectly configured
- Missing or set to a placeholder
- Pointing to a non-existent Firebase service account

### 2. **Vercel Environment Variables Not Set**
The Firebase credentials in Vercel might not be properly synced from `.env.local`:
- Missing `FIREBASE_PRIVATE_KEY`
- Missing `FIREBASE_CLIENT_EMAIL`
- Missing `FIREBASE_PROJECT_ID`

### 3. **Firestore Security Rules**
The Firestore rules might be rejecting requests from the service account.

## Solution Steps

### Step 1: Verify Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify these variables are set correctly:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_PRIVATE_KEY` (server-side)
   - `FIREBASE_CLIENT_EMAIL` (server-side)
   - `FIREBASE_PROJECT_ID` (server-side, matches above)

### Step 2: Verify Firebase Service Account
1. Go to Firebase Console → Project Settings
2. Navigate to **Service Accounts** tab
3. Click **Generate New Private Key**
4. Copy the JSON content
5. In Vercel, set:
   - `FIREBASE_CLIENT_EMAIL`: Email from the JSON (e.g., `firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com`)
   - `FIREBASE_PRIVATE_KEY`: Full private key from JSON (copy entire key including `-----BEGIN/END-----`)
   - `FIREBASE_PROJECT_ID`: Project ID from JSON

### Step 3: Check Firestore Security Rules
1. Go to Firebase Console → Firestore Database → Rules
2. Verify rules allow service account access:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 4: Redeploy After Changes
1. After updating environment variables in Vercel
2. Trigger a new deployment (or push a commit to main branch)
3. Wait for deployment to complete
4. Test the application

## Quick Checklist
- [ ] All Firebase credentials are properly set in Vercel
- [ ] `FIREBASE_CLIENT_EMAIL` is a valid service account email (not `copilot@github.com`)
- [ ] `FIREBASE_PRIVATE_KEY` is the complete private key with line breaks preserved
- [ ] `FIREBASE_PROJECT_ID` matches your Firebase project
- [ ] Firestore rules allow authenticated requests
- [ ] Deployment has completed after env var changes
- [ ] Browser cache is cleared (Ctrl+Shift+Delete or Cmd+Shift+Delete)

## If Still Getting Error
The error message "copilot@github.com" suggests:
1. The environment variable is using a placeholder/default value
2. Check that the `.env.local` file is NOT being committed to Git
3. Verify Vercel is pulling from the correct branch (main)
4. Check Vercel Logs for more detailed error messages

## Vercel Logs
1. Go to Vercel Dashboard → Deployments
2. Click the latest deployment
3. Click "Runtime Logs" to see detailed errors
4. Look for Firebase-related error messages
