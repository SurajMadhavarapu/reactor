# REACTOR - Startup Ideas Collaboration Platform

## ⚛️ Overview

**REACTOR** is a cutting-edge web application for sharing, discussing, and collaborating on startup ideas with an Iron Man-themed UI. Powered by Next.js, Firebase, and Vercel, it provides a secure, real-time platform where teams can track ideas from concept to launch.

## 🚀 Features

- ✅ **Secure Authentication** - Email/Password, 2FA, Rate limiting
- ✅ **Idea Management** - Create, share, collaborate on startup ideas
- ✅ **Real-time Collaboration** - Invite team members, live updates
- ✅ **Interactive Progress Bar** - Liquid animations, mouse-reactive
- ✅ **Community Features** - Upvote, comment, discuss ideas
- ✅ **Role-Based Access** - Owner, Collaborator, Viewer roles
- ✅ **Iron Man Theme** - Gold (#FFD700), Deep Red, Dark Steel colors
- ✅ **Enterprise Security** - 2FA, Email verification, Firestore rules, CSRF protection

## 📋 Quick Setup

### 1. Prerequisites
- Node.js 18+
- Firebase project (free tier works)
- Vercel account (for deployment)

### 2. Environment Setup
Create .env.local:
\\\nv
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\\\

### 3. Install & Run
\\\ash
npm install
npm run dev
\\\

Open http://localhost:3000

### 4. Deploy to Vercel
\\\ash
npm i -g vercel
vercel
\\\

## 🔐 Security Features

- **Authentication**: Firebase with email/password
- **2FA**: Time-based One-Time Password (TOTP)
- **Rate Limiting**: 5 failed attempts = 15 min lockout
- **Email Verification**: Required before activation
- **Password Policy**: 8+ chars, numbers, special characters
- **Session Management**: 1-hour JWT token expiration
- **Data Isolation**: Firestore rules for user-based access
- **Input Validation**: Client-side & server-side XSS prevention
- **HTTPS**: Automatic with Vercel
- **Audit Logs**: Track login attempts, admin actions

## 🎨 Design

**Iron Man Color Palette**:
- Gold: #FFD700 (accent, glow effects)
- Deep Red: #A91C0A (hero section, highlights)
- Dark Steel: #2C3E50 (background, nav)
- Bright Orange: #FF4500 (energy, progress indicators)

**Interactive Elements**:
- Liquid progress bar with mouse tracking
- Smooth hover animations & transitions
- Real-time activity indicators
- Particle effects on interactions
- Responsive design for all devices

## 📚 Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| Backend | Firebase (Auth, Firestore) |
| Hosting | Vercel |
| Database | Firestore (NoSQL) |
| Animations | Framer Motion |

## 📖 Pages

- **/**: Home page with feature overview
- **/signup**: User registration with password validation
- **/login**: Login with rate-limited attempts
- **/dashboard**: Main hub for ideas & collaboration
- **/ideas**: Browse all startup ideas
- **/ideas/new**: Create new idea
- **/ideas/[id]**: View idea details, progress, comments

## 🔒 Firestore Structure

\\\
/users/{userId}
  - email, username, displayName
  - twoFAEnabled, createdAt

/ideas/{ideaId}
  - title, description, category
  - ownerId, ownerName, collaborators
  - progress, upvotes, createdAt

/comments/{commentId}
  - ideaId, userId, content
  - createdAt, updatedAt

/invites/{inviteId}
  - ideaId, email, role, expiresAt
\\\

## 🚀 Deployment Checklist

- [ ] Set all Firebase credentials in .env.local
- [ ] Run \
pm run build\ locally without errors
- [ ] Test signup/login flow
- [ ] Test 2FA setup
- [ ] Test creating & updating ideas
- [ ] Push to GitHub
- [ ] Connect Vercel to GitHub repo
- [ ] Add env vars in Vercel dashboard
- [ ] Deploy & test live link
- [ ] Share with friends!

## 🐛 Troubleshooting

**Build fails**: Check TypeScript errors with \
pm run type-check\
**Firebase errors**: Verify .env.local variables match your Firebase project
**2FA issues**: Ensure device time is in sync, use Google Authenticator
**Ideas not loading**: Check Firestore security rules in Firebase console

## 📞 Next Steps

1. Setup Firebase project
2. Configure environment variables
3. Run \
pm run dev\ locally
4. Test signup/login
5. Create a test idea
6. Deploy to Vercel
7. Share link with friends!

---

**REACTOR is ready to launch!** 🚀⚛️
