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

  useEffect(() => {
    const stored = loadStoredAuth();
    if (stored) {
      setUser(stored.user);
      setRole(stored.role);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  function login(email, password) {
    const mockUser = { email, name: email.split("@")[0] };
    const mockRole = "student";
    const mockToken = "mock-jwt-token";

    setUser(mockUser);
    setRole(mockRole);
    setToken(mockToken);
    persistAuth({ user: mockUser, role: mockRole, token: mockToken });
  }

  function register(data, registrationRole) {
    const mockUser = { email: data.email, name: data.name };
    const mockToken = "mock-jwt-token";

    setUser(mockUser);
    setRole(registrationRole);
    setToken(mockToken);
    persistAuth({ user: mockUser, role: registrationRole, token: mockToken });
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
