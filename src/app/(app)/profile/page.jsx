"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Droplet,
  Calendar,
  Users,
  MapPin,
  Save,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getMyProfile, updateMyProfile } from "@/services/profile";
import { useDonationCooldown } from "@/hooks/useDonationCooldown";


export default function ProfilePage() {
  const { loading, user, updateUser } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

 const {
  canDonate,
  remainingDays,
  lastDonationDate,
  nextEligibleDate,
  loading: cooldownLoading,
} = useDonationCooldown();



  // =========================
  // Load profile (FIXED: No infinite loop)
  // =========================
  useEffect(() => {
    if (loading) return;

    let isMounted = true; // 🔥 Prevent state updates after unmount

    (async () => {
      try {
        const profile = await getMyProfile();
        
        if (!isMounted) return; // 🔥 Don't update if component unmounted
        
        console.log("✅ Profile loaded:", profile);
        
        updateUser(profile);

        setForm({
          full_name: profile.full_name ?? "",
          email: profile.email ?? "",
          phone_number: profile.phone_number ?? "",
          blood_type: profile.blood_type ?? "",
          date_of_birth: profile.date_of_birth ?? "",
          gender: profile.gender ?? "",
          address: profile.address ?? "",
          last_donation_date: profile.last_donation_date ?? "",
        });

        setAvatarPreview(profile.avatar_url || "");
      } catch (err) {
        if (!isMounted) return; // 🔥 Don't update if component unmounted
        console.error("❌ Error loading profile:", err);
        setError(err.message);
      }
    })();

    // 🔥 Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [loading]); // 🔥 ONLY 'loading', NOT 'updateUser'!

  // =========================
  // Upload avatar (BACKEND)
  // =========================
  async function uploadAvatarToBackend() {
    if (!avatarFile) return user?.avatar_url || null;

    const auth = JSON.parse(localStorage.getItem("auth"));
    if (!auth?.token) throw new Error("Not authenticated");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const res = await fetch(
      "https://borejak-backend.vercel.app/api/profile/avatar",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        body: formData,
      }
    );

    const text = await res.text();
    if (!res.ok) throw new Error(text || "Avatar upload failed");

    const data = JSON.parse(text);
    return data.avatar_url;
  }

  // =========================
  // Save profile
  // =========================
  async function saveProfile() {
    try {
      setSaving(true);
      setError("");
      setSuccess(false);

      // Validate required fields
      if (!form.full_name || !form.blood_type || !form.date_of_birth) {
        setError("Full name, blood type, and date of birth are required");
        setSaving(false);
        return;
      }

      // Validate: last_donation_date should not be in the future
      if (form.last_donation_date) {
        const lastDonation = new Date(form.last_donation_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastDonation.setHours(0, 0, 0, 0);
        
        if (lastDonation > today) {
          setError("Last donation date cannot be in the future");
          setSaving(false);
          return;
        }
      }

      const avatar_url = await uploadAvatarToBackend();

      const payload = {
        full_name: form.full_name,
        email: form.email,
        phone_number: form.phone_number,
        blood_type: form.blood_type,
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        address: form.address,
        last_donation_date: form.last_donation_date,
        avatar_url,
      };

      console.log("📤 Sending payload to backend:", payload);

      const response = await updateMyProfile(payload);
      console.log("✅ Backend response:", response);

      updateUser({
        ...user,
        ...payload,
        profile_completed: true,
      });

      setSuccess(true);
      console.log("✅ Profile saved successfully!");

      setTimeout(() => {
        console.log("🔄 Redirecting to home...");
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error("❌ Error saving profile:", err);
      setError(err.message || "Failed to save profile");
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-red-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 mt-4 font-medium">Loading profile…</p>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-slate-600 hover:text-red-600 mb-8 transition-all"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:bg-red-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-semibold">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 to-rose-600 rounded-full shadow-lg shadow-red-500/30 mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-600">Manage your personal information</p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="font-medium">Profile updated successfully! Redirecting...</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-6 mb-10 pb-10 border-b border-slate-200">
            <img
              src={
                avatarPreview ||
                user?.avatar_url ||
                "/avatars/default-avatar.png"
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-4 border-red-200 shadow-lg"
            />

            <label className="cursor-pointer">
              <input
                type="file"
                hidden
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }}
              />
              <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition shadow-lg">
                Change Avatar
              </span>
            </label>
          </div>

          {/* Form */}
          <div className="space-y-6 mb-10">

            {/* Full Name */}
            <Field icon={User} label="Full Name *">
              <input
                className="input"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
              />
            </Field>

            {/* Email (Read-only) */}
            <Field icon={Mail} label="Email">
              <input 
                className="input bg-slate-100 cursor-not-allowed" 
                value={form.email} 
                disabled 
                placeholder="Email from registration"
              />
              <p className="text-xs text-slate-500 mt-1">ℹ️ Email cannot be changed</p>
            </Field>

            {/* Phone */}
            <Field icon={Phone} label="Phone Number">
              <input
                className="input"
                placeholder="Enter your phone number"
                value={form.phone_number}
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
              />
            </Field>

            {/* Blood Type */}
            <Field icon={Droplet} label="Blood Type *">
              <select
                className="input"
                value={form.blood_type}
                onChange={(e) =>
                  setForm({ ...form, blood_type: e.target.value })
                }
              >
                <option value="">Select blood type</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>

            {/* Date of Birth */}
            <Field icon={Calendar} label="Date of Birth *">
              <input
                type="date"
                className="input"
                value={form.date_of_birth}
                onChange={(e) =>
                  setForm({ ...form, date_of_birth: e.target.value })
                }
              />
            </Field>

            {/* Gender */}
            <Field icon={Users} label="Gender">
              <div className="grid grid-cols-3 gap-3">
                {["male", "female", "other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      form.gender === g
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </Field>

            {/* Address */}
            <Field icon={MapPin} label="Address">
              <textarea
                className="input"
                rows={3}
                placeholder="Enter your address (optional)"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </Field>
          </div>


          {/* Save Button */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tailwind helper */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #cbd5e1;
          outline: none;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .input:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

// =========================
// Reusable field wrapper
// =========================
function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
        <Icon size={18} className="text-red-600" />
        {label}
      </label>
      {children}
    </div>
  );
}