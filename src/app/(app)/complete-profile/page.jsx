"use client";

import { useState } from "react";
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

  function updateField(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function submit() {
    try {
      setSubmitting(true);

      await apiFetch("/api/profile", {
        method: "POST",
        body: form,
      });

      // ✅ update ONLY user object
      updateUser({
        ...user,
        ...form,
        profile_completed: true,
      });

      router.replace("/profile");
    } catch (err) {
      setError(err.message);
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
