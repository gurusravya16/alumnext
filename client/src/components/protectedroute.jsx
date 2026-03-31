import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function getRoleHome(role) {
  if (role === "alumni") return "/dashboard/alumni-home";
  if (role === "admin") return "/dashboard/student";
  return "/dashboard/student";
}

export default function ProtectedRoute({ allowedRoles } = {}) {
  const { isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1F3A]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const normalizedRole = role ? String(role).toLowerCase() : null;
    if (normalizedRole && !allowedRoles.includes(normalizedRole)) {
      return <Navigate to={getRoleHome(normalizedRole)} replace />;
    }
    if (!normalizedRole) {
      return <Navigate to={getRoleHome("student")} replace />;
    }
  }

  return <Outlet />;
}
