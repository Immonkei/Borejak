"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import PhoneLogin from "@/components/auth/PhoneLogin";
import Link from "next/link";
import { Heart, Droplets, Clock, MapPin, Award } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState("email"); // email | phone
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

      await handleAuthSuccess(res);
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 to-rose-700 p-12 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white p-3 rounded-xl">
              <Droplets className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">Borejak</h1>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome Back, Hero
          </h2>
          <p className="text-red-100 mb-10">
            Continue your life-saving journey.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Stat icon={Heart} value="50K+" label="Lives Saved" />
            <Stat icon={Award} value="15K+" label="Active Donors" />
            <Stat icon={MapPin} value="200+" label="Centers" />
            <Stat icon={Clock} value="24/7" label="Support" />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Sign in to continue saving lives
          </p>

          {/* LOGIN MODE SWITCH */}
          <div className="flex mb-6 rounded-lg overflow-hidden border">
            <button
              onClick={() => setMode("email")}
              className={`flex-1 py-2 font-semibold ${
                mode === "email"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setMode("phone")}
              className={`flex-1 py-2 font-semibold ${
                mode === "phone"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Phone OTP
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* EMAIL LOGIN */}
          {mode === "email" ? (
            <>
              <input
                type="email"
                placeholder="Email"
                className="border w-full px-4 py-3 rounded mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="border w-full px-4 py-3 rounded mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Logging in..." : "Sign In"}
              </button>
            </>
          ) : (
            <PhoneLogin onSuccess={handleAuthSuccess} />
          )}

          {/* DIVIDER */}
          <div className="my-6 text-center text-gray-500 text-sm">
            Or continue with
          </div>

          {/* GOOGLE LOGIN */}
          <GoogleLoginButton
            onSuccess={handleAuthSuccess}
            onError={() => setError("Google sign-in failed")}
            disabled={loading}
          />

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-red-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* SMALL STAT COMPONENT */
function Stat({ icon: Icon, value, label }) {
  return (
    <div className="bg-white/10 rounded-xl p-4 text-white">
      <Icon className="w-5 h-5 mb-2" />
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
