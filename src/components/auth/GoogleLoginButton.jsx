"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";
import { useState } from "react";

export default function GoogleLoginButton({
  onSuccess,
  onError,
  disabled,
}) {
  const [busy, setBusy] = useState(false);

  async function handleGoogle() {
    if (busy || disabled) return;

    setBusy(true);

    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await cred.user.getIdToken();

      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { firebaseToken },
      });

      onSuccess(res);
    } catch (err) {
      console.error("Google login error:", err);
      onError?.("Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleGoogle}
      disabled={disabled || busy}
      className="w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-60"
    >
      {busy ? "Signing in..." : "Continue with Google"}
    </button>
  );
}
