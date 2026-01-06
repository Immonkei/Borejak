"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import Link from "next/link";
import { Heart, Droplets, Clock, MapPin, Award } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleAuthSuccess(res) {
    const finalUser = await login(res);

    if (finalUser.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (finalUser.profile_completed) {
      router.replace("/profile");
    } else {
      router.replace("/complete-profile");
    }
  }

  async function handleLogin() {
    setError("");

    if (!email || !password) {
      return setError("Email and password are required");
    }

    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const firebaseToken = await cred.user.getIdToken();

      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { firebaseToken },
      });

      handleAuthSuccess(res);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* Left Side - Branding & Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-rose-700 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl">
              <Droplets className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">LifeStream</h1>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Welcome Back, Hero
          </h2>
          <p className="text-red-100 text-lg mb-12">
            Continue your life-saving journey. Every login brings you closer to
            making a difference.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-white" />
                <span className="text-3xl font-bold text-white">50K+</span>
              </div>
              <p className="text-red-100 text-sm">Lives Saved</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-white" />
                <span className="text-3xl font-bold text-white">15K+</span>
              </div>
              <p className="text-red-100 text-sm">Active Donors</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-white" />
                <span className="text-3xl font-bold text-white">200+</span>
              </div>
              <p className="text-red-100 text-sm">Donation Centers</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-5 border border-white border-opacity-20">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-3xl font-bold text-white">24/7</span>
              </div>
              <p className="text-red-100 text-sm">Support Available</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20">
            <div className="flex items-start gap-4">
              <div className="bg-yellow-400 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Urgent Need</h3>
                <p className="text-red-100 text-sm mb-3">
                  O- blood type urgently needed at Central Hospital
                </p>
                <button className="bg-white text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-red-100 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>1,247 donors active today</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <Droplets className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">LifeStream</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">Sign in to continue saving lives</p>
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
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="border border-gray-300 w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Remember me for 30 days
                </label>
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white py-3.5 rounded-lg font-semibold disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-red-200 hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Or continue with
                  </span>
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
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                >
                  Sign Up
                </Link>
              </p>

              <div className="pt-4 border-t border-gray-200 mt-6">
                <p className="text-xs text-center text-gray-500">
                  Protected by industry-standard encryption
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Need help?</p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Link href="/support" className="text-red-600 hover:underline">
                Contact Support
              </Link>
              <span className="text-gray-300">|</span>
              <Link href="/faq" className="text-red-600 hover:underline">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
