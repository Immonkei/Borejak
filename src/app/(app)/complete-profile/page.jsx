"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CompleteProfile() {
  const router = useRouter();
  const { loading, user, updateUser } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
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
    setForm(prev => ({
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
    return <div className="p-6 text-center">Loading authentication…</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Complete Profile</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3">
          {error}
        </div>
      )}

      <input
        name="full_name"
        placeholder="Full Name *"
        className="border w-full p-2 mb-2"
        value={form.full_name}
        onChange={updateField}
      />

      <select
        name="blood_type"
        className="border w-full p-2 mb-2"
        value={form.blood_type}
        onChange={updateField}
      >
        <option value="">Select Blood Type *</option>
        <option value="A+">A+</option>
        <option value="A-">A-</option>
        <option value="B+">B+</option>
        <option value="B-">B-</option>
        <option value="AB+">AB+</option>
        <option value="AB-">AB-</option>
        <option value="O+">O+</option>
        <option value="O-">O-</option>
      </select>

      <input
        type="date"
        name="date_of_birth"
        className="border w-full p-2 mb-2"
        value={form.date_of_birth}
        onChange={updateField}
      />

      <select
        name="gender"
        className="border w-full p-2 mb-2"
        value={form.gender}
        onChange={updateField}
      >
        <option value="">Select Gender (optional)</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      <input
        name="address"
        placeholder="Address (optional)"
        className="border w-full p-2 mb-4"
        value={form.address}
        onChange={updateField}
      />

      <button
        onClick={submit}
        disabled={submitting}
        className="w-full bg-red-600 text-white p-2 rounded"
      >
        {submitting ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
