import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const sidebarItems = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "Posts", path: "/dashboard/posts", icon: "📝" },
  { label: "Profile", path: "/dashboard/profile", icon: "👤" },
  { label: "Connections", path: "/dashboard/connections", icon: "🤝" },
  { label: "Opportunities", path: "/dashboard/opportunities", icon: "💼" },
];

export default function DashboardLayout() {
  const { user, role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B1F3A]/5 flex">
      <aside className="w-64 bg-[#0B1F3A] border-r border-[#D4AF37]/20 flex flex-col">
        <div className="p-6 border-b border-[#D4AF37]/20">
          <h2 className="text-lg font-bold text-white">AlumNext</h2>
          <p className="mt-1 text-sm text-[#D4AF37]/80 capitalize">{role} Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive
                    ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full rounded-lg bg-[#D4AF37]/20 text-[#D4AF37] px-3 py-2.5 text-sm font-medium hover:bg-[#D4AF37]/30"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-white">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8">
          <h1 className="text-lg font-semibold text-[#0B1F3A] capitalize">
            {role} Dashboard
          </h1>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
