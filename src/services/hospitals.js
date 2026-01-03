import { apiFetch } from "@/lib/api";

// ✅ LIST hospitals (admin sees all)
export async function getHospitals() {
  const res = await apiFetch("/api/hospitals");
  return res.data; // IMPORTANT
}

// ✅ CREATE
export function createHospital(data) {
  return apiFetch("/api/hospitals", {
    method: "POST",
    body: data,
  });
}


// ✅ UPDATE
export function updateHospital(id, data) {
  return apiFetch(`/api/hospitals/${id}`, {
    method: "PUT",
    body: data,
  });
}

// ✅ DELETE
export function deleteHospital(id) {
  return apiFetch(`/api/hospitals/${id}`, {
    method: "DELETE",
  });
}
