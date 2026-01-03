import { apiFetch } from "@/lib/api";

// ✅ GET current user profile
export async function getMyProfile() {
  const res = await apiFetch("/api/profile");
  return res.user; // 🔥 FIX HERE
}

// ✅ UPDATE profile
export async function updateMyProfile(payload) {
  const res = await apiFetch("/api/profile", {
    method: "POST",
    body: payload,
  });
  return res.user ?? res;
}
