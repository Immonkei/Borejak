"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { User, Droplet, Calendar, Users, MapPin, Phone, ArrowRight, Heart } from "lucide-react";

export default function CompleteProfile() {
  const router = useRouter();
  const { loading, user, updateUser } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    blood_type: "",
    date_of_birth: "",
    gender: "",
    address: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 🔒 BLOCK invalid access
  useEffect(() => {
    if (loading) return;

    if (user?.role === "admin") {
      router.replace("/admin");
      return;
    }

    if (user?.profile_completed === true) {
      router.replace("/profile");
    }
  }, [loading, user, router]);

  function updateField(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function submit() {
    setError("");

    if (!form.full_name || !form.blood_type || !form.date_of_birth) {
      return setError("Full name, blood type, and date of birth are required");
    }

    setSubmitting(true);

    try {
      const res = await apiFetch("/api/profile", {
        method: "POST",
        body: form,
      });

      updateUser({
        ...res.user,
        profile_completed: true,
      });

      router.replace("/profile");
    } catch (err) {
      setError(err.message || "Failed to complete profile");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-12 px-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-full shadow-lg shadow-red-500/30 mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Complete Your Profile</h1>
          <p className="text-slate-600">Help us personalize your blood donation experience</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-red-500" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="full_name"
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={form.full_name}
                onChange={updateField}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                Phone Number
              </label>
              <input
                name="phone_number"
                type="tel"
                placeholder="Enter your phone number (e.g., 012345678)"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={form.phone_number}
                onChange={updateField}
              />
            </div>

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-500" />
                Blood Type <span className="text-red-500">*</span>
              </label>
              <select
                name="blood_type"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                value={form.blood_type}
                onChange={updateField}
              >
                <option value="">Select blood type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                value={form.date_of_birth}
                onChange={updateField}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['male', 'female', 'other'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setForm({ ...form, gender })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      form.gender === gender
                        ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                        : 'bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                Address
              </label>
              <textarea
                name="address"
                placeholder="Enter your address (optional)"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                rows={3}
                value={form.address}
                onChange={updateField}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-8 pb-8">
            <button
              onClick={submit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-center text-sm text-slate-500 mt-4">
              <span className="text-red-500">*</span> Required fields
            </p>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Your information helps us match you with blood donation opportunities in your area.
        </p>
      </div>
    </div>
  );
}