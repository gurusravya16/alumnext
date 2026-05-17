import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HandshakeIcon } from "../components/ui/OutlineIcons";
import api from "../services/api";

function formatDate(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusBadge(status) {
  const map = {
    PENDING: "bg-yellow-500/20 text-yellow-300",
    APPROVED: "bg-green-500/20 text-green-300",
    REJECTED: "bg-red-500/20 text-red-300",
  };
  return map[status] || "bg-gray-500/20 text-gray-300";
}

export default function DashboardMentorship() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await api.get("/mentorship/student");
        setRequests(data?.data?.requests ?? []);
      } catch {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Mentorships</h1>
        <button
          type="button"
          onClick={() => navigate("/dashboard/alumni")}
          className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2 hover:brightness-110 transition-all"
        >
          Find Alumni
        </button>
      </div>

      {loading ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center text-[#8892a4]">
          Loading...
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-8 shadow-sm text-center">
          <HandshakeIcon className="w-10 h-10 text-[#f0b429] mx-auto mb-4" />
          <p className="text-white font-medium">
            No mentorship sessions yet. Browse alumni and request a session to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="text-white font-bold truncate">
                  {req.alumni?.name || "Alumni"}
                </div>
                <div className="text-[#8892a4] text-sm mt-1">
                  {formatDate(req.date)} &middot; {req.time}
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusBadge(req.status)}`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

