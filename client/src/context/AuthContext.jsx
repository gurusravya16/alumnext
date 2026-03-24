import { createContext, useContext, useState, useEffect } from "react";

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

  // On mount: load from localStorage (no API)
  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored?.user && stored?.token) {
      setUser(stored.user);
      setRole(stored.role || "student");
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  function login(_email, _password) {
    const mockUser = { id: 1, name: "Test User", email: "test@example.com" };
    const mockRole = "student";
    const mockToken = "dummy-token";
    setUser(mockUser);
    setRole(mockRole);
    setToken(mockToken);
    persistAuth({ user: mockUser, role: mockRole, token: mockToken });
    return mockUser;
  }

  function register(data, registrationRole) {
    const mockUser = {
      id: 1,
      name: data.name || data.fullName || "Test User",
      email: data.email || "test@example.com",
    };
    const mockRole = registrationRole || "student";
    const mockToken = "dummy-token";
    setUser(mockUser);
    setRole(mockRole);
    setToken(mockToken);
    persistAuth({ user: mockUser, role: mockRole, token: mockToken });
    return mockUser;
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
