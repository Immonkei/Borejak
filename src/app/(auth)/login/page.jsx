'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import PhoneLogin from '@/components/auth/PhoneLogin';
import Link from 'next/link';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      // 1️⃣ Firebase login
      const cred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Firebase token
      const firebaseToken = await cred.user.getIdToken();

      // 3️⃣ Backend login
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { firebaseToken },
      });

      // 4️⃣ Save auth
      login({
  token: res.token || res.data?.token,
  user: res.user || res.data?.user,
});

      // 5️⃣ Redirect ONCE (this is OK)
     router.replace("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          className="border p-2 w-full rounded"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full rounded"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-red-600 text-white w-full p-2 rounded"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <GoogleLoginButton />
        <PhoneLogin />

        <p className="text-sm text-center">
          No account?{' '}
          <Link href="/register" className="text-red-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
