import { apiFetch } from "@/lib/api";

// 🌍 Public testimonials
export function getPublicTestimonials() {
  return apiFetch("/api/testimonials");
}

// 👤 User submits testimonial
export function createTestimonial(payload) {
  return apiFetch("/api/testimonials", {
    method: "POST",
    body: payload,
  });
}

// 🔒 Admin — all testimonials
export function getAllTestimonials() {
  return apiFetch("/api/testimonials/admin");
}

// 🔒 Admin — approve
export function approveTestimonial(id) {
  return apiFetch(`/api/testimonials/admin/${id}/approve`, {
    method: "PUT",
  });
}

// 🔒 Admin — delete
export function deleteTestimonial(id) {
  return apiFetch(`/api/testimonials/admin/${id}`, {
    method: "DELETE",
  });
}


// 🔒 Admin — update
export function updateTestimonial(id, payload) {
  return apiFetch(`/api/testimonials/admin/${id}`, {
    method: "PUT",
    body: payload,
  });
}
