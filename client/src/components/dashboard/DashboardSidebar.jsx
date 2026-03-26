import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "./Avatar";

const navItems = [
  { label: "Dashboard", path: "/dashboard/student" },
  { label: "Alumni", path: "/dashboard/alumni" },
  { label: "Mentorship", path: "/dashboard/mentorship" },
  { label: "Profile", path: "/dashboard/profile" },
];

export default function DashboardSidebar() {
  const { user, role, logout } = useAuth();
  const displayName = user?.name || "Student";
  const portalRole = role
    ? String(role).charAt(0).toUpperCase() + String(role).slice(1)
    : "Student";

  return (
    <aside className="w-[250px] bg-[#071020] fixed top-0 left-0 h-screen border-r border-[#1e3a5f] flex flex-col">
      <div className="p-5 border-b border-[#1e3a5f]">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="AlumNext"
            className="w-10 h-10 rounded-full object-cover border border-[#f0b429]/40"
          />
          <div className="text-white font-bold text-lg leading-tight">
            AlumNext
          </div>
        </div>
        <div className="mt-2 text-xs text-[#f0b429]/80 capitalize">
          {portalRole} Portal
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/dashboard/student"}
            className={({ isActive }) => {
              const base =
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200";
              if (isActive) {
                return `${base} bg-[#112240]/70 text-[#f0b429] border-l-4 border-[#f0b429] pl-2`;
              }
              return `${base} text-[#8892a4] hover:bg-[#112240]/60 hover:text-white border-l-4 border-transparent pl-2`;
            }}
          >
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1e3a5f]">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={displayName} size={44} />
          <div className="min-w-0">
            <div className="text-white text-sm font-semibold truncate">
              {displayName}
            </div>
            <div className="text-xs text-[#8892a4] truncate">
              {user?.email || ""}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-lg bg-[#f0b429]/15 text-[#f0b429] px-3 py-2.5 text-sm font-medium hover:bg-[#f0b429]/25 transition-all"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

