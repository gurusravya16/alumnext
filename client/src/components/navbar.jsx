import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname.startsWith("/signup");
  const showLoggedInNav = isAuthenticated && !isAuthPage;

  return (
    <nav className="bg-[#0B1F3A] border-b border-[#D4AF37]/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">
            AlumNext
          </Link>

          <div className="flex items-center gap-4">
            {showLoggedInNav ? (
              <>
                <Link
                  to="/dashboard/posts"
                  className="text-sm font-medium text-gray-300 hover:text-[#D4AF37]"
                >
                  Posts
                </Link>
                <button
                  onClick={logout}
                  className="rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 text-sm font-medium hover:bg-[#D4AF37]/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-300 hover:text-[#D4AF37]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#0B1F3A] hover:brightness-110"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
