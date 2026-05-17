import { useState, useEffect } from "react";
import api from "../../services/api";
import { MegaphoneIcon } from "../ui/OutlineIcons";

function formatDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await api.get("/announcements");
        setAnnouncements(data?.data?.announcements ?? []);
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <MegaphoneIcon className="w-6 h-6 text-[#f0b429]" />
        <h2 className="text-xl font-bold text-white">From the College</h2>
      </div>

      {loading ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 text-center">
          <p className="text-[#8892a4] text-sm">Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 text-center">
          <p className="text-[#8892a4] text-sm">No announcements at this time.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="min-w-[320px] bg-[#112240] border border-[#1e3a5f] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-[6px] bg-[#f0b429]/30 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-white font-semibold">{a.title}</h3>
                    <p className="text-[#8892a4] text-xs whitespace-nowrap">
                      {formatDate(a.createdAt)}
                    </p>
                  </div>
                  <p className="mt-2 text-[#cbd5e1] text-sm leading-relaxed">
                    {a.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
