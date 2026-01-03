export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(path, { method = "GET", body } = {}) {
  const stored = localStorage.getItem("auth");
  const token = stored ? JSON.parse(stored).token : null;

  const url = `${API_BASE_URL}${path}`;
  console.log("API FETCH →", url);
  console.log("TOKEN USED →", token);

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}
