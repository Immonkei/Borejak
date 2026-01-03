'use client';

import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function GoogleLoginButton() {
  const { login } = useAuth();

  async function handleGoogle() {
    const cred = await signInWithPopup(auth, googleProvider);

    const firebaseToken = await cred.user.getIdToken();

    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: { firebaseToken },
    });

    login(res);
  }

  return (
    <button
      onClick={handleGoogle}
      className="w-full border p-2 rounded"
    >
      Continue with Google
    </button>
  );
}
