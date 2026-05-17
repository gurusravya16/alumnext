import { useState, useEffect } from "react";
import api from "../../services/api";
import { MegaphoneIcon } from "../../components/ui/OutlineIcons";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function fetchAnnouncements() {
    try {
      const { data } = await api.get("/announcements");
      setAnnouncements(data?.data?.announcements || []);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  async function submit() {
    setError("");
    setSuccess(false);
    if (!form.title.trim() || !form.content.trim()) {
      return setError("Title and content are required.");
    }
    
    setCreating(true);
    try {
      await api.post("/admin/announcements", {
        title: form.title.trim(),
        content: form.content.trim()
      });
      setSuccess(true);
      setForm({ title: "", content: "" });
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCreating(false);
    }
  }

  function formatDate(d) {
    const dt = new Date(d);
    return Number.isNaN(dt.getTime())
      ? ""
      : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Announcements</h1>
        <p className="text-[#8892a4] mt-1 text-sm">Post and manage college-wide announcements.</p>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MegaphoneIcon className="w-5 h-5 text-[#f0b429]" />
          New Announcement
        </h2>
        {error ? <div className="mb-4 bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl p-4 text-sm">{error}</div> : null}
        {success ? <div className="mb-4 bg-[#22c55e]/15 border border-[#22c55e]/30 text-white rounded-xl p-4 text-sm font-semibold">Announcement posted successfully!</div> : null}

        <div className="space-y-4">
          <div>
            <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Announcement Title</label>
            <input 
              value={form.title} 
              onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} 
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200" 
              placeholder="e.g. Campus Placement Drive" 
            />
          </div>
          <div>
             <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Message Content</label>
             <textarea 
               value={form.content} 
               onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} 
               rows={4} 
               className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200 resize-y" 
             />
          </div>
          <button 
            type="button" 
            onClick={submit} 
            disabled={creating} 
            className="w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 mt-2 hover:brightness-110 disabled:opacity-50 transition-all"
          >
            {creating ? "Posting..." : "Post Announcement"}
          </button>
        </div>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-4">Past Announcements</h2>
        {loading ? (
          <div className="text-[#8892a4]">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="text-[#8892a4]">No announcements have been posted yet.</div>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a.id} className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold">{a.title}</h3>
                  <span className="text-[#8892a4] text-xs whitespace-nowrap">{formatDate(a.createdAt)}</span>
                </div>
                <p className="text-[#cbd5e1] text-sm mt-2 whitespace-pre-wrap">{a.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
