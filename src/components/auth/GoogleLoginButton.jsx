"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

export default function GoogleLoginButton({
  onSuccess,
  onError,
  disabled,
}) {
  async function handleGoogle() {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await cred.user.getIdToken();

      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { firebaseToken },
      });

      onSuccess(res);
    } catch (err) {
      console.error(err);
      onError?.();
    }
  }

  return (
    <button
      onClick={handleGoogle}
      disabled={disabled}
      className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium"
    >
      Continue with Google
    </button>
  );
}
