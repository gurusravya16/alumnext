import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

const ROLE_COLORS = {
  STUDENT: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  ALUMNI: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const STATUS_COLORS = {
  APPROVED: "bg-green-500/20 text-green-300 border-green-500/30",
  PENDING: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

function formatDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterYear, setFilterYear] = useState("ALL");
  const [filterBranch, setFilterBranch] = useState("ALL");
  const [filterJobTitle, setFilterJobTitle] = useState("ALL");

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setAllUsers(data.data.users || []);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  // Derive unique dropdown options from the full user list
  const yearOptions = useMemo(() => {
    const years = [...new Set(allUsers.map((u) => u.year).filter(Boolean))].sort((a, b) => a - b);
    return years;
  }, [allUsers]);

  const branchOptions = useMemo(() => {
    const branches = [...new Set(allUsers.map((u) => u.branch).filter(Boolean))].sort();
    return branches;
  }, [allUsers]);

  const jobTitleOptions = useMemo(() => {
    const titles = [...new Set(allUsers.map((u) => u.jobTitle).filter(Boolean))].sort();
    return titles;
  }, [allUsers]);

  // Client-side filtering (fast, no extra API calls)
  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      if (filterRole !== "ALL" && u.role !== filterRole) return false;
      if (filterYear !== "ALL" && String(u.year) !== filterYear) return false;
      if (filterBranch !== "ALL" && u.branch !== filterBranch) return false;
      if (filterJobTitle !== "ALL" && u.jobTitle !== filterJobTitle) return false;
      const q = search.toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allUsers, search, filterRole, filterYear, filterBranch, filterJobTitle]);

  function showToast(type, text) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Permanently delete ${name}'s account? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/users/${id}`);
      setAllUsers((prev) => prev.filter((u) => u.id !== id));
      showToast("success", `${name}'s account deleted.`);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setFilterRole("ALL");
    setFilterYear("ALL");
    setFilterBranch("ALL");
    setFilterJobTitle("ALL");
  }

  const hasActiveFilters = filterRole !== "ALL" || filterYear !== "ALL" || filterBranch !== "ALL" || filterJobTitle !== "ALL" || search;

  const selectClass = "rounded-lg bg-[#112240] border border-[#1e3a5f] px-3 py-2 text-white text-sm focus:outline-none focus:border-[#f0b429] transition-all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-[#8892a4] mt-1 text-sm">View, filter and manage all registered users.</p>
      </div>

      {toast && (
        <div className={`rounded-xl p-4 text-sm font-semibold border ${toast.type === "success" ? "bg-green-500/15 border-green-500/30 text-green-200" : "bg-red-500/15 border-red-500/30 text-red-200"}`}>
          {toast.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm font-semibold">Filters</span>
          {hasActiveFilters && (
            <button type="button" onClick={resetFilters} className="text-xs text-[#f0b429] hover:underline">
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name/email..."
            className={`${selectClass} lg:col-span-2`}
          />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className={selectClass}>
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="ALUMNI">Alumni</option>
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={selectClass}>
            <option value="ALL">All Years</option>
            {yearOptions.map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
          </select>
          <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} className={selectClass}>
            <option value="ALL">All Branches</option>
            {branchOptions.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        {jobTitleOptions.length > 0 && (
          <select value={filterJobTitle} onChange={(e) => setFilterJobTitle(e.target.value)} className={`${selectClass} w-full sm:w-auto`}>
            <option value="ALL">All Job Titles</option>
            {jobTitleOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        )}
      </div>

      {/* User list */}
      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-[#8892a4] text-center">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-[#8892a4] text-center">No users match the current filters.</div>
        ) : (
          <div className="divide-y divide-[#1e3a5f]">
            {filtered.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 hover:bg-[#0a1628]/40 transition-all">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold">{u.name}</span>
                    <span className={`text-xs border rounded-full px-2 py-0.5 font-semibold ${ROLE_COLORS[u.role] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                      {u.role}
                    </span>
                    <span className={`text-xs border rounded-full px-2 py-0.5 font-semibold ${STATUS_COLORS[u.status] || "bg-gray-500/20 text-gray-300 border-gray-500/30"}`}>
                      {u.status}
                    </span>
                  </div>
                  <div className="text-[#8892a4] text-sm mt-0.5">{u.email}</div>
                  <div className="text-[#8892a4] text-xs mt-0.5 flex flex-wrap gap-x-2">
                    {u.branch && <span>{u.branch}</span>}
                    {u.year && <span>Batch {u.year}</span>}
                    {u.company && <span>{u.company}</span>}
                    {u.jobTitle && <span className="text-[#f0b429]/80">{u.jobTitle}</span>}
                    {u.createdAt && <span>· Joined {formatDate(u.createdAt)}</span>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(u.id, u.name)}
                  disabled={deletingId === u.id}
                  className="shrink-0 rounded-lg border border-red-500/40 text-red-400 text-sm font-semibold px-3 py-1.5 hover:bg-red-500/10 disabled:opacity-50 transition-all"
                >
                  {deletingId === u.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
        {!loading && (
          <div className="px-4 py-3 border-t border-[#1e3a5f] text-xs text-[#8892a4]">
            {filtered.length} of {allUsers.length} user{allUsers.length !== 1 ? "s" : ""} shown
          </div>
        )}
      </div>
    </div>
  );
}
