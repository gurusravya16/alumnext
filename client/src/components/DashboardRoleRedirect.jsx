import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardRoleRedirect() {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const normalizedRole = role ? String(role).toLowerCase() : "student";

  const roleRedirects = {
    alumni: "/dashboard/alumni-home",
    admin: "/dashboard/student",   // admin uses student layout for now
    student: "/dashboard/student",
  };
  const to = roleRedirects[normalizedRole] || "/dashboard/student";

  return <Navigate to={to} replace />;
}

