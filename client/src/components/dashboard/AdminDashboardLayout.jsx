import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <AdminSidebar />
      <main className="ml-[250px] min-h-screen flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
