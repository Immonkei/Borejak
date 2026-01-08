"use client";

import { useEffect, useState } from "react";
import { User, Mail, Droplet, Calendar, Users, MapPin, Save, CheckCircle, AlertCircle, Phone, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getMyProfile, updateMyProfile } from "@/services/profile";

export default function ProfilePage() {
  const { loading, user, updateUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (loading) return;

    (async () => {
      try {
        const profile = await getMyProfile();
        updateUser(profile);

        setForm({
          full_name: profile.full_name ?? "",
          email: profile.email ?? "",
          phone_number: profile.phone_number ?? "",
          blood_type: profile.blood_type ?? "",
          date_of_birth: profile.date_of_birth ?? "",
          gender: profile.gender ?? "",
          address: profile.address ?? "",
        });
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [loading]);

  async function saveProfile() {
    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      await updateMyProfile(form);

      updateUser({
        ...user,
        ...form,
        profile_completed: true,
      });

      setSuccess(true);
      
      // Redirect to home page after 1.5 seconds
      setTimeout(() => {
        router.push("/");
      }, 1500);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError("");
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-red-100 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const isProfileComplete = form.full_name && form.blood_type && form.date_of_birth && form.gender;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:bg-red-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-rose-600 rounded-full shadow-lg shadow-red-500/30 mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your personal information and preferences</p>
        </div>

        {/* Profile Completion Notice */}
        {!isProfileComplete && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Complete Your Profile</h3>
              <p className="text-sm text-yellow-800">
                Please fill in all required fields to activate full features.
              </p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Profile updated successfully!</p>
              <p className="text-green-600 text-sm">Redirecting to home page...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                Personal Information
              </h2>
              
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number (e.g., 012345678)"
                    value={form.phone_number}
                    onChange={(e) => handleChange('phone_number', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Blood Type & Date of Birth */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-red-500" />
                      Blood Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.blood_type}
                      onChange={(e) => handleChange('blood_type', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
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

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={form.date_of_birth}
                      onChange={(e) => handleChange('date_of_birth', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['male', 'female', 'other'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => handleChange('gender', gender)}
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
                    placeholder="Enter your complete address"
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Save Button */}
          <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                <span className="text-red-500">*</span> Required fields
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 hover:border-red-200 hover:text-red-600 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  disabled={saving || !form.full_name || success}
                  className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {isProfileComplete ? '100%' : '60%'}
                </div>
                <div className="text-sm text-slate-600">Profile Complete</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-xl">
                <Droplet className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">
                  {form.blood_type || '--'}
                </div>
                <div className="text-sm text-slate-600">Blood Type</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800">Active</div>
                <div className="text-sm text-slate-600">Account Status</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}