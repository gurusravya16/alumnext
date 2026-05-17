import { useState, useEffect } from "react";
import Avatar from "../../components/dashboard/Avatar";
import api from "../../services/api";

function formatDateTime(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusBadge(status) {
  const map = {
    PENDING: "bg-yellow-500/20 text-yellow-300",
    APPROVED: "bg-green-500/20 text-green-300",
    REJECTED: "bg-red-500/20 text-red-300",
  };
  return map[status] || "bg-gray-500/20 text-gray-300";
}

export default function AlumniMentorshipRequests() {
  const [tab, setTab] = useState("Pending");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);

  function toast(msg) {
    setToastMessage(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 6000);
  }

  async function fetchRequests() {
    setLoading(true);
    try {
      const { data } = await api.get("/mentorship/alumni");
      setRequests(data?.data?.requests ?? []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function onAccept(req) {
    setActionId(req.id);
    try {
      await api.patch(`/mentorship/${req.id}`, { status: "APPROVED" });
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "APPROVED" } : r))
      );
      toast(`Session with ${req.student?.name || "student"} approved.`);
    } catch {
      toast("Failed to approve request.");
    } finally {
      setActionId(null);
    }
  }

  async function onDecline(req) {
    const ok = window.confirm("Are you sure you want to decline this request?");
    if (!ok) return;
    setActionId(req.id);
    try {
      await api.patch(`/mentorship/${req.id}`, { status: "REJECTED" });
      setRequests((prev) =>
        prev.map((r) => (r.id === req.id ? { ...r, status: "REJECTED" } : r))
      );
      toast("Request declined.");
    } catch {
      toast("Failed to decline request.");
    } finally {
      setActionId(null);
    }
  }

  const pending = requests.filter((r) => r.status === "PENDING");
  const resolved = requests.filter((r) => r.status !== "PENDING");
  const list = tab === "Pending" ? pending : resolved;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Mentorship Requests</h1>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setTab("Pending")}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 font-bold ${
            tab === "Pending"
              ? "bg-[#f0b429] text-[#0a1628] border-[#f0b429]"
              : "bg-transparent border-[#1e3a5f] text-[#8892a4] hover:border-[#f0b429]/40"
          }`}
        >
          Pending ({pending.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("Resolved")}
          className={`px-4 py-2 rounded-lg border transition-all duration-200 font-bold ${
            tab === "Resolved"
              ? "bg-[#f0b429] text-[#0a1628] border-[#f0b429]"
              : "bg-transparent border-[#1e3a5f] text-[#8892a4] hover:border-[#f0b429]/40"
          }`}
        >
          Resolved ({resolved.length})
        </button>
      </div>

      {loading ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center text-[#8892a4]">
          Loading...
        </div>
      ) : list.length === 0 ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center text-[#8892a4]">
          {tab === "Pending" ? "No pending mentorship requests." : "No resolved requests yet."}
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((req) => (
            <div
              key={req.id}
              className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <Avatar name={req.student?.name || "Student"} size={56} />
                <div className="min-w-0">
                  <div className="text-white font-bold truncate">
                    {req.student?.name || "Student"}
                  </div>
                  <div className="text-[#8892a4] text-sm mt-1">
                    {formatDateTime(req.date)} &middot; {req.time}
                  </div>
                  <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${statusBadge(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              </div>

              {req.status === "PENDING" && (
                <div className="flex flex-col gap-3 items-end shrink-0">
                  <button
                    type="button"
                    disabled={actionId === req.id}
                    onClick={() => onAccept(req)}
                    className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={actionId === req.id}
                    onClick={() => onDecline(req)}
                    className="rounded-lg border border-red-500/40 bg-transparent text-red-300 px-4 py-2.5 text-sm font-bold hover:bg-red-500/10 transition-all duration-200"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom-right toast */}
      {toastOpen ? (
        <div className="fixed bottom-6 right-6 z-[500] w-[340px] max-w-[calc(100vw-2rem)]">
          <div className="bg-[#112240] border border-[#1e3a5f] border-l-4 border-[#f0b429] text-white rounded-xl px-4 py-3 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm leading-relaxed">{toastMessage}</div>
              <button
                type="button"
                onClick={() => setToastOpen(false)}
                className="text-white/90 hover:text-white"
                aria-label="Close toast"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

