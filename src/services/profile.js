import { apiFetch } from "@/lib/api";

// ✅ GET current user profile
export async function getMyProfile() {
  const res = await apiFetch("/api/profile");
  return res.user; // Now includes last_donation_date
}

// ✅ UPDATE profile
export async function updateMyProfile(payload) {
  const res = await apiFetch("/api/profile", {
    method: "POST",
    body: payload,
  });
  return res.user ?? res;
}

// 🔥 NEW: Check 90-day cooldown status
export async function checkDonationStatus() {
  try {
    const res = await apiFetch("/api/profile/donation-status");
    return res.data || { 
      canDonate: true, 
      remainingDays: 0, 
      lastDonationDate: null,
      nextEligibleDate: null 
    };
  } catch (err) {
    console.warn("Failed to check donation status:", err);
    // Default to allowing donation if check fails
    return { 
      canDonate: true, 
      remainingDays: 0, 
      lastDonationDate: null,
      nextEligibleDate: null 
    };
  }
}

// 🔥 NEW: Get profile with donations + cooldown (for dashboard)
export async function getProfileWithDonations() {
  try {
    const res = await apiFetch("/api/profile/with-donations");
    return res.data || { 
      donations: [], 
      canDonate: true, 
      remainingDays: 0 
    };
  } catch (err) {
    console.warn("Failed to get profile with donations:", err);
    return { 
      donations: [], 
      canDonate: true, 
      remainingDays: 0 
    };
  }
}