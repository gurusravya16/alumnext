import { Outlet } from "react-router-dom";
import Navbar from "./navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0B1F3A]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
