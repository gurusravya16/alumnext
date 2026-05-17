import { useEffect, useState } from "react";
import api from "../../services/api";

function formatDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminApprovals() {
  const [activeTab, setActiveTab] = useState("registrations"); // registrations | ads
  
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [toast, setToast] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === "registrations") {
        const { data } = await api.get("/admin/approvals");
        setUsers(data.data.users || []);
      } else {
        const { data } = await api.get("/ads");
        setAds(data.data.ads || []);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [activeTab]);

  async function handleApprove(id) {
    setActioningId(id);
    try {
      await api.put(`/admin/approvals/${id}/approve`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setToast({ type: "success", text: "Alumni approved successfully." });
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Failed to approve." });
    } finally {
      setActioningId(null);
      setTimeout(() => setToast(null), 3500);
    }
  }

  async function handleReject(id, name) {
    if (!window.confirm(`Reject and permanently remove ${name}'s account?`)) return;
    setActioningId(id);
    try {
      await api.delete(`/admin/approvals/${id}/reject`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setToast({ type: "success", text: "User rejected and removed." });
    } catch (err) {
      setToast({ type: "error", text: err.response?.data?.message || "Failed to reject." });
    } finally {
      setActioningId(null);
      setTimeout(() => setToast(null), 3500);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Pending Review</h1>
        <p className="text-[#8892a4] mt-1 text-sm">Review alumni registrations and active advertisements.</p>
      </div>

      <div className="flex gap-4 border-b border-[#1e3a5f] pb-1">
        <button
          onClick={() => setActiveTab("registrations")}
          className={`pb-2 text-sm font-semibold transition-colors ${
            activeTab === "registrations" ? "text-[#f0b429] border-b-2 border-[#f0b429]" : "text-[#8892a4] hover:text-white"
          }`}
        >
          Alumni Registrations
        </button>
        <button
          onClick={() => setActiveTab("ads")}
          className={`pb-2 text-sm font-semibold transition-colors ${
            activeTab === "ads" ? "text-[#f0b429] border-b-2 border-[#f0b429]" : "text-[#8892a4] hover:text-white"
          }`}
        >
          Advertisements
        </button>
      </div>

      {toast && (
        <div className={`rounded-xl p-4 text-sm font-semibold border ${toast.type === "success" ? "bg-green-500/15 border-green-500/30 text-green-200" : "bg-red-500/15 border-red-500/30 text-red-200"}`}>
          {toast.text}
        </div>
      )}

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        {loading ? (
          <div className="text-[#8892a4]">Loading...</div>
        ) : activeTab === "registrations" ? (
          users.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-[#f0b429] text-4xl mb-3">✓</div>
              <div className="text-white font-semibold">No pending approvals</div>
              <div className="text-[#8892a4] text-sm mt-1">All alumni registrations are up to date.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.id} className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-bold text-lg">{u.name}</span>
                      <span className="text-xs bg-[#f0b429]/20 text-[#f0b429] border border-[#f0b429]/30 rounded-full px-2 py-0.5 font-semibold">
                        PENDING
                      </span>
                    </div>
                    <div className="text-[#8892a4] text-sm mt-1">{u.email}</div>
                    <div className="text-[#8892a4] text-sm mt-0.5">
                      {[u.branch, u.year && `Batch ${u.year}`].filter(Boolean).join(" · ")}
                    </div>
                    {u.linkedin && (
                      <a href={u.linkedin} target="_blank" rel="noreferrer" className="text-[#f0b429] text-sm hover:underline mt-1 inline-block">
                        LinkedIn ↗
                      </a>
                    )}
                    {u.bio && (
                      <p className="text-[#cbd5e1] text-sm mt-2 line-clamp-2">{u.bio}</p>
                    )}
                    <div className="text-[#8892a4] text-xs mt-2">Registered: {formatDate(u.createdAt)}</div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(u.id)}
                      disabled={actioningId === u.id}
                      className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2 text-sm hover:brightness-110 disabled:opacity-50 transition-all"
                    >
                      {actioningId === u.id ? "..." : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(u.id, u.name)}
                      disabled={actioningId === u.id}
                      className="rounded-lg border border-red-500/40 text-red-400 font-semibold px-4 py-2 text-sm hover:bg-red-500/10 disabled:opacity-50 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          ads.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-[#f0b429] text-4xl mb-3">✓</div>
              <div className="text-white font-semibold">No active advertisements</div>
            </div>
          ) : (
            <div className="space-y-4">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-4 flex justify-between items-start gap-4">
                  <div className="min-w-0">
                     <div className="text-white font-bold">{ad.title}</div>
                     <div className="text-[#8892a4] text-sm">{ad.company || "Unknown Company"} • {ad.type || "Job"}</div>
                     <div className="text-[#8892a4] text-xs mt-1">Last Date: {ad.lastDate ? formatDate(ad.lastDate) : "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
