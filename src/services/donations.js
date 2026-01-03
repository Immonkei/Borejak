import { apiFetch } from "@/lib/api";

// 👤 USER — my donations
export async function getMyDonations() {
  const res = await apiFetch("/api/donations/me");
  return res.data;
}

// 🛠 ADMIN — all donations
export async function getAllDonations() {
  const res = await apiFetch("/api/donations");
  return res.data;
}

// 🛠 ADMIN — update status
// export function updateDonationStatus(id, payload) {
//   const { status, quantity_ml } = payload;

//   if (status === "approved" || status === "rejected") {
//     return apiFetch(`/api/donations/${id}/status`, {
//       method: "PUT",
//       body: { status },
//     });
//   }

//   if (status === "completed") {
//     if (!quantity_ml || quantity_ml <= 0) {
//       throw new Error("quantity_ml is required to complete donation");
//     }

//     return apiFetch(`/api/donations/${id}/status`, {
//       method: "PUT",
//       body: payload,
//     });
//   }

//   throw new Error("Invalid donation status");
// }
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

