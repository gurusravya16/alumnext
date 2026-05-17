import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardRoleRedirect() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const normalizedRole = role ? String(role).toLowerCase() : "student";
  const roleHomeMap = {
    alumni: "/dashboard/alumni-home",
    admin: "/dashboard/admin-home",
  };
  const to = roleHomeMap[normalizedRole] || "/dashboard/student";

  return <Navigate to={to} replace />;
}

