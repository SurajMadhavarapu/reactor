import { signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user data exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (!userDoc.exists()) {
      // Create new user document
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        username: user.displayName?.toLowerCase().replace(/\s+/g, '_') || user.email?.split('@')[0],
        displayName: user.displayName || 'Google User',
        createdAt: new Date(),
        updatedAt: new Date(),
        twoFAEnabled: false,
        emailVerified: user.emailVerified,
        photoURL: user.photoURL,
        authProvider: 'google',
      });
    }

    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled');
    }
    throw error;
  }
}
