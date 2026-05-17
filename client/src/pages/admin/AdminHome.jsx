import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  UsersIcon,
  BriefcaseIcon,
  FileTextIcon,
  GraduationCapIcon,
  HandshakeIcon,
} from "../../components/ui/OutlineIcons";

export default function AdminHome() {
  const { user } = useAuth();
  const name = user?.name || "Admin";

  const [stats, setStats] = useState({ 
    totalUsers: null, 
    totalAlumni: null, 
    pendingApprovals: null, 
    activeAds: null,
    totalPosts: null,
    totalMentorships: null,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get("/admin/stats");
        if (data?.data) setStats(data.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Students", value: stats.totalUsers, icon: UsersIcon },
    { label: "Total Alumni", value: stats.totalAlumni, icon: GraduationCapIcon },
    { label: "Community Posts", value: stats.totalPosts, icon: FileTextIcon },
    { label: "Mentorship Sessions", value: stats.totalMentorships, icon: HandshakeIcon },
    { label: "Pending Approvals", value: stats.pendingApprovals, icon: FileTextIcon },
    { label: "Active Ads", value: stats.activeAds, icon: BriefcaseIcon },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Welcome, {name}</h1>
        <p className="text-[#8892a4] mt-2">T&P Cell Admin Dashboard</p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-[#f0b429]" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {value === null ? <span className="animate-pulse text-[#8892a4]">—</span> : value}
                  </div>
                  <div className="text-[#8892a4] text-sm font-medium">{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm space-y-2">
        <h2 className="text-lg font-bold text-white mb-3">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a href="/dashboard/admin-approvals" className="flex items-center gap-2 rounded-lg bg-[#0a1628] border border-[#1e3a5f] p-3 text-[#f0b429] font-semibold hover:bg-[#1e3a5f] transition-all">
            <FileTextIcon className="w-5 h-5" /> Approvals
          </a>
          <a href="/dashboard/admin-users" className="flex items-center gap-2 rounded-lg bg-[#0a1628] border border-[#1e3a5f] p-3 text-[#f0b429] font-semibold hover:bg-[#1e3a5f] transition-all">
            <UsersIcon className="w-5 h-5" /> Manage Users
          </a>
          <a href="/dashboard/admin-ads" className="flex items-center gap-2 rounded-lg bg-[#0a1628] border border-[#1e3a5f] p-3 text-[#f0b429] font-semibold hover:bg-[#1e3a5f] transition-all">
            <BriefcaseIcon className="w-5 h-5" /> Manage Ads
          </a>
        </div>
      </section>
    </div>
  );
}
