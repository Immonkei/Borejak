import { apiFetch } from "@/lib/api";

/**
 * Admin: list newsletter subscribers
 * GET /api/newsletter
 */
export function getNewsletterSubscribers() {
  return apiFetch("/api/newsletter").then(res => res.data);
}

/**
 * Public: subscribe email
 * POST /api/newsletter/subscribe
 */
export function subscribeNewsletter(email) {
  return apiFetch("/api/newsletter/subscribe", {
    method: "POST",
    body: { email },
  });
}
