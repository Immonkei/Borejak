import { apiFetch } from "@/lib/api";

// 🌍 Public
export async function getTips() {
  const res = await apiFetch("/api/tips");
  return res.data;
}

// 🔒 Admin
export function createTip(data) {
  return apiFetch("/api/tips", {
    method: "POST",
    body: data,
  });
}

export function updateTip(id, data) {
  return apiFetch(`/api/tips/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteTip(id) {
  return apiFetch(`/api/tips/${id}`, {
    method: "DELETE",
  });
}
