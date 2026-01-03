import { apiFetch } from "@/lib/api";

/**
 * Get current user's donation benefits
 * Auth required
 * GET /api/benefits/me
 */
export function getMyBenefits() {
  return apiFetch("/api/benefits/me").then(res => res.data);
}
