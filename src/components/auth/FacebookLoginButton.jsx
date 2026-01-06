"use client";

import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

export default function FacebookLoginButton({
  onSuccess,
  onError,
  disabled,
}) {
  async function handleFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const firebaseToken = await result.user.getIdToken();

      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: { firebaseToken },
      });

      onSuccess?.(res);
    } catch (err) {
      console.error(err);
      onError?.(err);
    }
  }

  return (
    <button
      onClick={handleFacebook}
      disabled={disabled}
      className="w-full bg-blue-600 text-white py-3 rounded-xl
                 flex items-center justify-center gap-3 hover:bg-blue-700
                 disabled:opacity-60"
    >
      Continue with Facebook
    </button>
  );
}
