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

  useEffect(() => {
    const stored = loadStoredAuth();
    const storedToken = stored?.token ?? stored?.accessToken;
    if (storedToken) {
      setToken(storedToken);
      setRole((stored?.role || "student").toLowerCase());
      if (stored?.user) setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    const { user: u, token: t } = data.data;
    const roleStr = (u.role || "STUDENT").toLowerCase();
    setUser(u);
    setRole(roleStr);
    setToken(t);
    persistAuth({ user: u, role: roleStr, token: t });
    return u;
  }

  async function register(data, registrationRole) {
    const roleUpper = (registrationRole || "student").toUpperCase();
    if (roleUpper !== "STUDENT" && roleUpper !== "ALUMNI") {
      throw new Error("Invalid role");
    }
    const payload = {
      name: data.name || data.fullName || "",
      email: data.email || "",
      password: data.password || "",
      role: roleUpper,
    };
    const { data: res } = await api.post("/auth/register", payload);
    const { user: u, token: t } = res.data;
    const roleStr = (u.role || "STUDENT").toLowerCase();
    setUser(u);
    setRole(roleStr);
    setToken(t);
    persistAuth({ user: u, role: roleStr, token: t });
    return u;
  }

  function updateUserName(nextName) {
    const cleaned = String(nextName ?? "").trim();
    setUser((prev) => ({ ...(prev || {}), name: cleaned }));

    // Persist updated user name into auth storage so the sidebar updates on refresh.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? JSON.parse(raw) : {};
      persistAuth({
        ...stored,
        user: {
          ...(stored.user || {}),
          name: cleaned,
        },
        role,
        token,
      });
    } catch {
      // If storage can't be parsed, still keep the in-memory state update.
    }
  }

  function logout() {
    setUser(null);
    setRole(null);
    setToken(null);
    clearAuth();
  }

  // IMPORTANT: For route protection we only need the JWT token.
  // Some older localStorage shapes may not include a full user object.
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        updateUserName,
        logout,
      }}
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
