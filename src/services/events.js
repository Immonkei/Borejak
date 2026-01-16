import { apiFetch } from "@/lib/api";

// 🌍 Public - Get all events
export async function getEvents() {
  const res = await apiFetch("/api/events");
  return res.data || [];
}

// 🌍 Public - Get single event
export async function getEventById(id) {
  const res = await apiFetch(`/api/events/${id}`);
  return res.data;
}

// 🔥 Register user for event (creates pending donation)
// FIXED: removed undefined 'payload' variable
export async function registerForEvent(eventId) {
  const res = await apiFetch(`/api/events/${eventId}/register`, {
    method: "POST",
  });
  return res;
}

// 🔒 Admin - Create event
export function createEvent(data) {
  return apiFetch("/api/events", {
    method: "POST",
    body: data,
  });
}

// 🔒 Admin - Update event
export function updateEvent(id, data) {
  return apiFetch(`/api/events/${id}`, {
    method: "PUT",
    body: data,
  });
}

// 🔒 Admin - Delete event
export function deleteEvent(id) {
  return apiFetch(`/api/events/${id}`, {
    method: "DELETE",
  });
}

export async function uploadEventImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await apiFetch("/api/events/upload-image", {
    method: "POST",
    body: formData,
    isFormData: true,
  });

  return res.data.url;
}