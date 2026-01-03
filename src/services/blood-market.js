import { apiFetch } from "@/lib/api";

/**
 * Public: list blood market items
 */
export function getBloodMarket(params = {}) {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/blood-market?${query}`).then(res => res.data);
}

/**
 * Public: get detail
 */
export function getBloodMarketDetail(id) {
  return apiFetch(`/api/blood-market/${id}`).then(res => res.data);
}

/**
 * User: create request / offer
 */
export function createBloodMarket(payload) {
  return apiFetch("/api/blood-market", {
    method: "POST",
    body: payload,
  });
}

/**
 * User: close own post
 */
export function closeBloodMarket(id) {
  return apiFetch(`/api/blood-market/${id}/close`, {
    method: "PUT",
  });
}


export function adminDeleteBloodMarket(id) {
  return apiFetch(`/api/blood-market/${id}`, {
    method: "DELETE",
  });
}