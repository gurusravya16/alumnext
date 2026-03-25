import { Outlet } from "react-router-dom";
import AlumniSidebar from "./AlumniSidebar";

export default function AlumniDashboardLayout() {
  return (
    <div className="min-h-screen bg-[#0a1628] text-white">
      <AlumniSidebar />
      <main className="ml-[250px] min-h-screen flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

