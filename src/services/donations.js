import { apiFetch } from "@/lib/api";

// 👤 USER — my donations
export async function getMyDonations() {
  try {
    const res = await apiFetch("/api/donations/me");
    return res.data || [];
  } catch (err) {
    console.warn("Failed to get donations:", err);
    return [];
  }
}

// 🛠 ADMIN — all donations
export async function getAllDonations() {
  try {
    const res = await apiFetch("/api/donations");
    return res.data || [];
  } catch (err) {
    console.warn("Failed to get all donations:", err);
    return [];
  }
}

// 🔥 NEW: Check if user can donate (90-day cooldown)
export async function checkCanDonate() {
  try {
    const res = await apiFetch("/api/donations/eligibility");
    return res.data || { canDonate: true };
  } catch (err) {
    console.warn("Failed to check donation eligibility:", err);
    return { canDonate: true };
  }
}

// 🛠 ADMIN — update status
export function updateDonationStatus(id, payload) {
  const { status, quantity_ml } = payload;

  if (status === "approved" || status === "rejected") {
    return apiFetch(`/api/donations/${id}/status`, {
      method: "PUT",
      body: { status },
    });
  }

  if (status === "completed") {
    if (!quantity_ml || quantity_ml <= 0) {
      throw new Error("quantity_ml is required to complete donation");
    }

    return apiFetch(`/api/donations/${id}/status`, {
      method: "PUT",
      body: payload,
    });
  }

  throw new Error("Invalid donation status");
}

<<<<<<< HEAD
// 🔥 NEW: Register for event (uses cooldown check)
export async function registerForEvent(eventId) {
  try {
    const res = await apiFetch(`/api/donations/events/${eventId}/register`, {
      method: "POST",
      body: {},
    });
    return res.data;
  } catch (err) {
    throw err;
  }
}
=======
// 👤 USER — donation eligibility

export async function getDonationEligibility() {
  const res = await apiFetch("/api/donations/eligibility");
  return res.data;
}
>>>>>>> ddb61ae678a4f5e2aa38b17416a120cc6c73f862
