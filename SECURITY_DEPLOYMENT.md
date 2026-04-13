# Security Deployment Guide

## Overview
This guide covers deploying REACTOR's security features to production.

---

## 1. Deploy Firestore Security Rules

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Logged in: `firebase login`
- Project initialized locally

### Steps

1. **Verify rules file exists**
   ```bash
   ls -la firestore.rules
   ```

2. **Update firebase.json** (create if doesn't exist):
   ```json
   {
     "firestore": {
       "rules": "firestore.rules",
       "indexes": "firestore.indexes.json"
     }
   }
   ```

3. **Deploy rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Verify deployment**
   - Go to Firebase Console → Firestore → Rules tab
   - Should see new rules reflected

### What These Rules Do
- ✅ Restrict database access to authenticated users only
- ✅ Prevent users from accessing others' profiles
- ✅ Enforce idea ownership for edits/deletes
- ✅ Validate input constraints (field lengths, types)
- ✅ Allow comments only on existing ideas

---

## 2. Security Headers (Already Deployed)

### Status: ✅ ACTIVE

Security headers are configured in `next.config.ts`:
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Browser XSS filter
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser APIs
- **HSTS**: Enforces HTTPS

These are automatically deployed by Vercel.

### Verify Headers
```bash
curl -I https://reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app
```

Should see:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
...
```

---

## 3. Content Security Policy (CSP)

### Optional: Add CSP Header

Add to `next.config.ts`:
```typescript
{
  key: "Content-Security-Policy",
  value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com https://identitytoolkit.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com; frame-src 'self' https://accounts.google.com;"
}
```

---

## 4. Rate Limiting (Already Active)

### Status: ✅ ACTIVE

- **Auth endpoints**: 5 attempts per 15 minutes
- **Tracks by**: Email address
- **Resets**: After successful login/signup

### Testing
1. Try logging in with wrong password 5 times
2. Get error: "Too many login attempts. Try again in X seconds"
3. Wait 15 minutes or successful login to reset

---

## 5. Input Validation (Already Active)

### Status: ✅ ACTIVE

All inputs sanitized and validated:
- Email: Format + length check
- Password: Strength requirements + size limit
- Username: Format + character restrictions
- Ideas: Title/description length limits
- Comments: Length limits

Dangerous patterns blocked:
- `<script>` tags
- `javascript:` URLs
- HTML event handlers
- `eval()` function calls

---

## 6. Firebase Auth Configuration

### Prerequisites
- Email/Password auth enabled
- Google OAuth enabled
- Custom domain configured (optional)

### Steps

1. **Go to Firebase Console**
   - Project: REACTOR
   - Authentication → Settings

2. **Verify Auth Providers**
   - ✅ Email/Password enabled
   - ✅ Google enabled

3. **Configure OAuth Redirect URIs**
   ```
   Authorized domains:
   - reactor-k5zrg4s17-surajmadhavarapus-projects.vercel.app
   - localhost:3000 (for dev)
   ```

4. **Set Password Policy**
   - Min length: 8
   - Require numbers: ✅
   - Require special chars: ✅

---

## 7. Vercel Configuration

### Required Environment Variables
Set in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

### Recommended Settings
- **HTTPS**: Automatic
- **Automatic deployments**: Enabled for main branch
- **Preview deployments**: Enabled for PRs

---

## 8. Monitoring & Logging

### Set Up Error Tracking (Optional)

1. **Sentry Integration** (recommended)
   ```bash
   npm install @sentry/nextjs
   ```
   
   Configure in Vercel dashboard with Sentry project

2. **LogRocket** (alternative)
   ```bash
   npm install logrocket
   ```

### Monitor
- Authentication failures
- API errors
- Rate limit hits
- Security events

---

## 9. Regular Security Maintenance

### Daily
- Monitor error logs
- Check authentication attempts

### Weekly
- Review Firestore activity logs
- Check for suspicious patterns

### Monthly
- Run `npm audit`
- Update dependencies
- Review Vercel security tab

### Quarterly
- Full security audit
- Penetration testing consideration
- Update security policies

---

## 10. Incident Response

### If Breach Suspected
1. **Immediately**
   - Disable affected user accounts
   - Rotate Firebase credentials
   - Check audit logs

2. **Within 1 hour**
   - Identify compromised data
   - Notify affected users
   - Disable vulnerable endpoints

3. **Within 24 hours**
   - Complete investigation
   - Security audit
   - Publish incident report

---

## Checklist

- [ ] Firestore security rules deployed
- [ ] Security headers verified
- [ ] HSTS enabled (auto on Vercel)
- [ ] Rate limiting tested
- [ ] Input validation working
- [ ] Environment variables set
- [ ] OAuth URIs configured
- [ ] Monitoring/logging set up
- [ ] Backup strategy in place
- [ ] Incident response plan documented

---

## Support

**Firebase Security Issues**: https://firebase.google.com/support  
**Vercel Security**: https://vercel.com/security  
**OWASP Guidelines**: https://owasp.org/

---

## Additional Resources

- `SECURITY_AUDIT.md` - Full security audit report
- `.env.local` - Local environment template
- `firestore.rules` - Firestore security rules
- `next.config.ts` - Security headers configuration

---

**Last Updated**: 2026-04-13  
**Security Level**: HIGH  
**Status**: PRODUCTION READY
