import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT ────────────────
api.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem("alumnext_auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.token ?? parsed?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // corrupted storage — ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ───────────────
let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    if (
      error.response?.status === 401 &&
      !isRedirecting &&
      !isLoginRequest
    ) {
      isRedirecting = true;
      localStorage.removeItem("alumnext_auth");
      window.location.href = "/login";
      setTimeout(() => {
        isRedirecting = false;
      }, 2000);
    }
    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;
