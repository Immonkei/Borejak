// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

// ✅ Prevent re-initializing Firebase on hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// ✅ REAL Auth instance (fixes Recaptcha error)
export const auth = getAuth(app);

// ✅ Provider
export const googleProvider = new GoogleAuthProvider();
