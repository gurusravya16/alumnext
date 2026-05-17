import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    title: "",
    company: "",
    type: "Full-Time Job",
    location: "",
    description: "",
    applyLink: "",
    lastDate: "",
    imageUrl: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [creating, setCreating] = useState(false);

  async function fetchAds() {
    try {
      const { data } = await api.get("/ads");
      setAds(data.data.ads || []);
    } catch (err) {
      console.error("Failed to fetch ads", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAds();
  }, []);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const required = [
      ["title", "Title"],
      ["company", "Company Name"],
      ["type", "Type"],
      ["location", "Location"],
      ["description", "Description"],
      ["applyLink", "Apply Link / Email"],
    ];
    for (const [key, label] of required) {
      if (!String(form[key] ?? "").trim()) return `${label} is required`;
    }
    return "";
  }

  async function submit() {
    setError("");
    setSuccess(false);
    const msg = validate();
    if (msg) return setError(msg);

    setCreating(true);
    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        type: form.type,
        location: form.location.trim(),
        description: form.description,
        applyLink: form.applyLink.trim(),
        lastDate: form.lastDate || undefined,
        imageUrl: form.imageUrl || undefined,
      };

      await api.post("/ads", payload);
      setSuccess(true);
      setForm({
        title: "", company: "", type: "Full-Time Job", location: "",
        description: "", applyLink: "", lastDate: "", imageUrl: "",
      });
      fetchAds();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Advertisements</h1>
        <p className="text-[#8892a4] mt-1 text-sm">Create and display job or internship ads.</p>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-4">Create New Advertisement</h2>
        {error ? <div className="mb-4 bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl p-4 text-sm">{error}</div> : null}
        {success ? <div className="mb-4 bg-[#22c55e]/15 border border-[#22c55e]/30 text-white rounded-xl p-4 text-sm font-semibold">Advertisement posted successfully!</div> : null}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Title</label>
              <input value={form.title} onChange={(e) => setField("title", e.target.value)} className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200" placeholder="e.g. Software Engineer Intern" />
            </div>
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Company Name</label>
              <input value={form.company} onChange={(e) => setField("company", e.target.value)} className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200" />
            </div>
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Role Type</label>
              <select value={form.type} onChange={(e) => setField("type", e.target.value)} className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200">
                <option>Internship</option>
                <option>Full-Time Job</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setField("location", e.target.value)} className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200" />
            </div>
          </div>
          
          <div>
            <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Description / Requirements</label>
            <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={4} className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200 resize-y" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Apply Link / Email</label>
              <input value={form.applyLink} onChange={(e) => setField("applyLink", e.target.value)} className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200" />
            </div>
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Last Date to Apply (optional)</label>
              <input type="date" value={form.lastDate} onChange={(e) => setField("lastDate", e.target.value)} className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200" />
            </div>
          </div>

          <div>
             <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Image URL (Optional Web URL)</label>
             <input value={form.imageUrl} onChange={(e) => setField("imageUrl", e.target.value)} type="url" placeholder="https://..." className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200" />
          </div>

          <button type="button" onClick={submit} disabled={creating} className="w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 mt-2 hover:brightness-110 disabled:opacity-50 transition-all">
            {creating ? "Posting..." : "Post Advertisement"}
          </button>
        </div>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white mb-4">Active Advertisements</h2>
        {loading ? (
          <div className="text-[#8892a4]">Loading ads...</div>
        ) : ads.length === 0 ? (
          <div className="text-[#8892a4]">No advertisements found.</div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-4 flex justify-between items-start gap-4">
                <div className="min-w-0">
                   <div className="text-white font-bold">{ad.title}</div>
                   <div className="text-[#8892a4] text-sm">{ad.company} • {ad.type}</div>
                   <div className="text-[#8892a4] text-xs mt-1">Last Date: {ad.lastDate || "—"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
