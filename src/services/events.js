import { apiFetch } from "@/lib/api";

// 🌍 Public
export async function getEvents() {
  const res = await apiFetch("/api/events");
  return res.data;
}

export async function getEventById(id) {
  const res = await apiFetch(`/api/events/${id}`);
  return res.data;
}


// 🔥 Register user for event
export function registerForEvent(eventId) {
  return apiFetch(`/api/events/${eventId}/register`, {
    method: "POST",
  });
}

// 🔒 Admin
export function createEvent(data) {
  return apiFetch("/api/events", {
    method: "POST",
    body: data,
  });
}

export function updateEvent(id, data) {
  return apiFetch(`/api/events/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteEvent(id) {
  return apiFetch(`/api/events/${id}`, {
    method: "DELETE",
  });
}
