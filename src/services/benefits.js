import { apiFetch } from "@/lib/api";

export function getMyBenefits() {
  return apiFetch("/api/benefits/me").then(res => res.data);
}

