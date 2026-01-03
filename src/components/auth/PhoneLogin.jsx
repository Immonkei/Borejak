'use client';

import { useState } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PhoneLogin() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  async function sendOTP() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      'recaptcha',
      { size: 'invisible' }
    );

    const result = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    setConfirmation(result);
  }

  async function verifyOTP() {
    const cred = await confirmation.confirm(otp);

    const firebaseToken = await cred.user.getIdToken();

    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: { firebaseToken },
    });

    login(res);
  }

  return (
    <div className="space-y-3">
      <input
        placeholder="+855..."
        className="border p-2 w-full"
        onChange={e => setPhone(e.target.value)}
      />

      <button onClick={sendOTP} className="border p-2 w-full">
        Send OTP
      </button>

      {confirmation && (
        <>
          <input
            placeholder="OTP"
            className="border p-2 w-full"
            onChange={e => setOtp(e.target.value)}
          />

          <button onClick={verifyOTP} className="bg-red-600 text-white p-2 w-full">
            Verify
          </button>
        </>
      )}

      <div id="recaptcha"></div>
    </div>
  );
}
