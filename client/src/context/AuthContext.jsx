import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "alumnext_auth";

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persistAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: verify stored token by calling GET /api/auth/me
  useEffect(() => {
    async function verifyToken() {
      const stored = loadStoredAuth();
      if (!stored?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        const freshUser = res.data.data.user;
        setUser(freshUser);
        setRole(freshUser.role);
        setToken(stored.token);
        // Update stored user with fresh data
        persistAuth({ user: freshUser, role: freshUser.role, token: stored.token });
      } catch {
        // Token invalid or expired — clear everything
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    }

    verifyToken();
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    const { user: userData, token: jwtToken } = res.data.data;

    setUser(userData);
    setRole(userData.role);
    setToken(jwtToken);
    persistAuth({ user: userData, role: userData.role, token: jwtToken });

    return userData;
  }

  async function register(data, registrationRole) {
    const res = await api.post("/auth/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      role: registrationRole.toUpperCase(),
    });
    const { user: userData, token: jwtToken } = res.data.data;

    setUser(userData);
    setRole(userData.role);
    setToken(jwtToken);
    persistAuth({ user: userData, role: userData.role, token: jwtToken });

    return userData;
  }

  function logout() {
    setUser(null);
    setRole(null);
    setToken(null);
    clearAuth();
  }

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{ user, role, token, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
