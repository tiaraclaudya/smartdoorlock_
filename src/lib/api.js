const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // respons tanpa body
  }

  if (!res.ok) {
    const message = data?.message || "Terjadi kesalahan. Silakan coba lagi.";
    throw new Error(message);
  }

  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: (token) => request("/auth/me", { token }),

  listCards: (token) => request("/cards", { token }),
  addCard: (token, payload) => request("/cards", { method: "POST", body: payload, token }),
  toggleCard: (token, id, is_active) => request(`/cards/${id}`, { method: "PATCH", body: { is_active }, token }),
  deleteCard: (token, id) => request(`/cards/${id}`, { method: "DELETE", token }),

  listLogs: (token) => request("/logs", { token }),

  doorStatus: (token) => request("/door/status", { token }),
  unlockDoor: (token) => request("/door/unlock", { method: "POST", token }),
};
