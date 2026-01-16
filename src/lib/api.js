export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  path,
  { method = "GET", body, isFormData = false } = {}
) {
  const stored = localStorage.getItem("auth");
  const token = stored ? JSON.parse(stored).token : null;

  const url = `${API_BASE_URL}${path}`;

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // ❗ ONLY set JSON header when NOT FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  let data = null;
 // ✅ CRITICAL FIX
  if (res.status !== 204) {
    try {
      data = await res.json();
    } catch {}
  }

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}
