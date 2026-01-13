"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Link from "next/link";
import { Heart, Droplets, Shield, Users } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");


  function handleAuthSuccess(res) {
    login(res);

    if (res.user?.profile_completed) {
      router.replace("/profile");
    } else {
      router.replace("/complete-profile");
    }
  }

  async function handleRegister() {
    setError("");

    if (!email || !password) {
      return setError("Email and password are required");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseToken = await cred.user.getIdToken();

      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { firebaseToken , phone_number: phoneNumber },
      });

      handleAuthSuccess(res);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Left Side - Branding & Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-rose-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl">
              <Droplets className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">Borejak</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join Our Community of Life Savers
          </h2>
          <p className="text-red-100 text-lg mb-12">
            Every donation can save up to three lives. Register today and become a hero in someone's story.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Save Lives</h3>
                <p className="text-red-100 text-sm">Your blood donation can help patients in emergency situations and those with chronic illnesses</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Safe & Secure</h3>
                <p className="text-red-100 text-sm">All donations follow strict medical protocols with certified professionals</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Join Thousands</h3>
                <p className="text-red-100 text-sm">Be part of a community that's making a real difference every day</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Droplets className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Borejak</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Start your journey as a blood donor hero</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="border border-gray-300 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Phone Number
  </label>
  <input
    type="tel"
    placeholder="012345678"
    className="border border-gray-300 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    disabled={loading}
  />
</div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  className="border border-gray-300 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3.5 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200 hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              <div className="space-y-3">
                <GoogleLoginButton
                  onSuccess={handleAuthSuccess}
                  onError={() => setError("Google sign-in failed")}
                  disabled={loading}
                />
              </div>

              <p className="text-sm text-center text-gray-600 pt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-red-600 hover:text-red-700 font-semibold hover:underline">
                  Sign In
                </Link>
              </p>

              <p className="text-xs text-center text-gray-500 pt-2">
                By registering, you agree to our{" "}
                <Link href="/terms" className="text-red-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-red-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}