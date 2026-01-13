"use client";

import { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";
import { PhoneAuthProvider, linkWithCredential } from "firebase/auth";

const RESEND_SECONDS = 60;

export default function PhoneLogin({ onSuccess }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const timerRef = useRef(null);

  // ⏱ Countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    timerRef.current = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  // 📱 Normalize Cambodia phone → +855
  function normalizePhone(input) {
    let p = input.replace(/\s+/g, "");
    if (p.startsWith("0")) p = "+855" + p.slice(1);
    if (!p.startsWith("+")) p = "+855" + p;
    return p;
  }

  async function sendOTP() {
    setError("");

    if (!phone) {
      setError("Phone number is required");
      return;
    }

    if (cooldown > 0 || sending) return;
    setSending(true);

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
          size: "invisible",
        });
      }

      const formattedPhone = normalizePhone(phone);

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        window.recaptchaVerifier
      );

      setConfirmation(result);
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      console.error("OTP error:", err);
      if (err.code === "auth/too-many-requests") {
        setError("Too many OTP requests. Please wait.");
      } else {
        setError("Failed to send OTP.");
      }
    } finally {
      setSending(false);
    }
  }

  async function verifyOTP() {
    setError("");

    if (!otp) {
      setError("OTP is required");
      return;
    }

    try {
      if (!auth.currentUser) {
        setError("Please login first");
        return;
      }

      const credential = PhoneAuthProvider.credential(
        confirmation.verificationId,
        otp
      );

      // 🔗 LINK phone to existing account
      await linkWithCredential(auth.currentUser, credential);

      // refresh token
      const firebaseToken = await auth.currentUser.getIdToken(true);

      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { firebaseToken },
      });

      // ✅ THIS WAS MISSING
      await onSuccess(res);
    } catch (err) {
      console.error(err);

      if (err.code === "auth/credential-already-in-use") {
        setError("This phone number is already linked to another account.");
      } else {
        setError("Invalid OTP");
      }
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-2 rounded">
          {error}
        </div>
      )}

      <input
        placeholder="071 234 567"
        className="border p-2 w-full rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={sending || cooldown > 0}
      />

      <button
        onClick={sendOTP}
        disabled={sending || cooldown > 0}
        className={`w-full p-2 rounded text-white ${
          cooldown > 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        {cooldown > 0
          ? `Resend OTP in ${cooldown}s`
          : sending
          ? "Sending..."
          : "Send OTP"}
      </button>

      {confirmation && (
        <>
          <input
            placeholder="Enter OTP"
            className="border p-2 w-full rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOTP}
            className="bg-red-600 hover:bg-red-700 text-white p-2 w-full rounded"
          >
            Verify OTP
          </button>
        </>
      )}

      <div id="recaptcha" />
    </div>
  );
}
