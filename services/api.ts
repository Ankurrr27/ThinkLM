import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "/api/v1",
});

// ── Request interceptor ────────────────────────────────────────────────────
// Automatically attach the JWT token from storage to every request.
// This means individual service calls don't need to pass the token manually,
// but existing calls that do pass it will still work (header is just overwritten).
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Response interceptor ───────────────────────────────────────────────────
// On a 401 (invalid / expired token), wipe stored credentials and redirect
// to /login so the user can authenticate again cleanly.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error?.response?.status === 401
    ) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
