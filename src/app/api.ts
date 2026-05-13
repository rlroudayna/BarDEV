// src/utils/api.ts
export const API_BASE_URL = "http://localhost:8080/api";

export async function authFetch(endpoint: string, options: any = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const contentType = res.headers.get("content-type");

  let data: any = null;

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = await res.text(); // <-- gérer texte brut
  }

  if (!res.ok) {
    // Si data est un objet JSON, essaye data.message, sinon prends le texte brut
    const errorMessage =
      typeof data === "string"
        ? data
        : data?.message || data?.error || "Erreur serveur";
    throw new Error(errorMessage);
  }

  return data;
}