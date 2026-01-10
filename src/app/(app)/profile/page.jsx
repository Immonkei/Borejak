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
  
} from "lucide-react";
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

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // =========================
  // Load profile
  // =========================
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

        setAvatarPreview(profile.avatar_url || "");
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [loading]);

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

      const avatar_url = await uploadAvatarToBackend();

      const payload = {
        ...form,
        avatar_url,
      };

      await updateMyProfile(payload);

      updateUser({
        ...user,
        ...payload,
        profile_completed: true,
      });

      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return <div className="p-6 text-center">Loading profile…</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        {/* Back */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
          <p className="text-slate-500">Manage your personal information</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl flex items-center gap-2">
            <CheckCircle size={18} /> Profile updated successfully
          </div>
        )}

        {/* Avatar */}
        <div className=" flex flex-col items-center ml-7 gap-6 mb-8 ">
          <img
            src={
              avatarPreview ||
              user?.avatar_url ||
              "/avatars/default-avatar.png"
            }
            alt="Avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-red-200"
          />

          <label className="cursor-pointer ">
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
            <span className="px-4 py-1.5  bg-red-600 text-white rounded-xl  hover:bg-red-700 transition ">
              Change Avatar
            </span>
          </label>
        </div>

        {/* Form */}
        <div className="space-y-5">

          {/* Full Name */}
          <Field icon={User} label="Full Name *">
            <input
              className="input"
              value={form.full_name}
              onChange={(e) =>
                setForm({ ...form, full_name: e.target.value })
              }
            />
          </Field>

          {/* Email */}
          <Field icon={Mail} label="Email">
            <input className="input bg-gray-100" value={form.email} disabled />
          </Field>

          {/* Phone */}
          <Field icon={Phone} label="Phone Number">
            <input
              className="input"
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

          {/* DOB */}
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
          <Field icon={Users} label="Gender *">
            <div className="grid grid-cols-3 gap-3">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setForm({ ...form, gender: g })}
                  className={`py-2 rounded-xl font-medium ${
                    form.gender === g
                      ? "bg-red-600 text-white"
                      : "bg-gray-100"
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
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </Field>
        </div>

        {/* Save */}
        <button
          onClick={saveProfile}
          disabled={saving}
          className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Tailwind helper */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #cbd5e1;
          outline: none;
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
      <label className="block text-sm font-semibold mb-1 flex items-center gap-2">
        <Icon size={16} className="text-red-600" />
        {label}
      </label>
      {children}
    </div>
  );
}
