import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function AlumniPostAdvertisement() {
  const { user } = useAuth();

  const [ads, setAds] = useState(() => {
    const raw = localStorage.getItem("alumnext_ads");
    const parsed = raw ? safeParse(raw, []) : [];
    return Array.isArray(parsed) ? parsed : [];
  });

  const myId = user?.id ?? "me";
  const myAds = useMemo(
    () => ads.filter((a) => String(a.authorId) === String(myId)),
    [ads, myId]
  );

  const [form, setForm] = useState({
    advertisementTitle: "",
    companyName: "",
    rolePosition: "",
    type: "Full-Time Job",
    location: "",
    description: "",
    requirements: "",
    apply: "",
    lastDateToApply: "",
    postToStudentFeed: true,
    imageBase64: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const required = [
      ["advertisementTitle", "Advertisement Title"],
      ["companyName", "Company Name"],
      ["rolePosition", "Role / Position"],
      ["type", "Type"],
      ["location", "Location"],
      ["description", "Job Description"],
      ["apply", "Apply Link / Email"],
      ["lastDateToApply", "Last Date to Apply"],
    ];
    for (const [key, label] of required) {
      const v = String(form[key] ?? "").trim();
      if (!v) return `${label} is required`;
    }
    if (String(form.description).length > 1000) return "Description must be within 1000 characters";
    if (String(form.requirements).length > 500) return "Requirements must be within 500 characters";
    return "";
  }

  async function onImageSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setField("imageBase64", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  }

  function deleteAd(adId) {
    const next = myAds.filter((a) => String(a.id) !== String(adId));
    const rest = ads.filter((a) => String(a.authorId) !== String(myId) || String(a.id) !== String(adId));
    const merged = [...rest, ...next];
    setAds(merged);
    localStorage.setItem("alumnext_ads", JSON.stringify(merged));
  }

  function statusForAd(ad) {
    const last = ad?.lastDateToApply || ad?.lastDate;
    if (!last) return "Active";
    const dt = new Date(last);
    if (Number.isNaN(dt.getTime())) return "Active";
    const t = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
    const today = new Date();
    const td = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    return t >= td ? "Active" : "Expired";
  }

  function submit() {
    setError("");
    setSuccess(false);
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const ad = {
      id: String(Date.now()),
      advertisementTitle: form.advertisementTitle.trim(),
      title: form.advertisementTitle.trim(),
      companyName: form.companyName.trim(),
      company: form.companyName.trim(),
      rolePosition: form.rolePosition.trim(),
      jobTitle: form.rolePosition.trim(),
      type: form.type,
      location: form.location.trim(),
      description: form.description,
      requirements: form.requirements,
      apply: form.apply.trim(),
      applyLinkOrEmail: form.apply.trim(),
      lastDateToApply: form.lastDateToApply,
      adImageBase64: form.imageBase64,
      postToStudentFeed: form.postToStudentFeed === true,
      authorId: myId,
      authorName: user?.name || "Alumni",
      createdAt: new Date().toISOString(),
    };

    const next = [ad, ...ads];
    const store = Array.isArray(next) ? next : [];
    setAds(store);
    localStorage.setItem("alumnext_ads", JSON.stringify(store));

    setSuccess(true);
    setForm({
      advertisementTitle: "",
      companyName: "",
      rolePosition: "",
      type: "Full-Time Job",
      location: "",
      description: "",
      requirements: "",
      apply: "",
      lastDateToApply: "",
      postToStudentFeed: true,
      imageBase64: null,
    });

    // TODO: POST /api/advertisements
    // TODO: connect ad image upload to backend/storage
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Post Advertisement</h1>
      {error ? <div className="bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl p-4 text-sm">{error}</div> : null}
      {success ? (
        <div className="bg-[#22c55e]/15 border border-[#22c55e]/30 text-white rounded-xl p-4 text-sm font-semibold">
          Advertisement posted successfully! Students will see this on their dashboard.
        </div>
      ) : null}

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Advertisement Title</label>
              <input
                value={form.advertisementTitle}
                onChange={(e) => setField("advertisementTitle", e.target.value)}
                className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
                placeholder="Software Engineer Intern at Google"
              />
            </div>
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Company Name</label>
              <input
                value={form.companyName}
                onChange={(e) => setField("companyName", e.target.value)}
                className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Role / Position</label>
              <input
                value={form.rolePosition}
                onChange={(e) => setField("rolePosition", e.target.value)}
                className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setField("type", e.target.value)}
                className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              >
                <option>Internship</option>
                <option>Full-Time Job</option>
                <option>Part-Time</option>
                <option>Contract</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Location</label>
              <input
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
                placeholder="Bangalore, India or Remote"
              />
            </div>
          </div>

          <div>
            <label className="text-[#8892a4] text-sm font-medium block mb-1.5">
              Job Description <span className="text-[#8892a4] text-xs">({form.description.length}/1000)</span>
            </label>
            <textarea
              value={form.description}
              maxLength={1000}
              onChange={(e) => setField("description", e.target.value)}
              rows={5}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200 resize-y"
            />
          </div>

          <div>
            <label className="text-[#8892a4] text-sm font-medium block mb-1.5">
              Requirements / Skills <span className="text-[#8892a4] text-xs">({form.requirements.length}/500)</span>
            </label>
            <textarea
              value={form.requirements}
              maxLength={500}
              onChange={(e) => setField("requirements", e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200 resize-y"
              placeholder="e.g. React, Node, SQL"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Apply Link / Email</label>
              <input
                value={form.apply}
                onChange={(e) => setField("apply", e.target.value)}
                className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Last Date to Apply</label>
              <input
                type="date"
                value={form.lastDateToApply}
                onChange={(e) => setField("lastDateToApply", e.target.value)}
                className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div>
              <label className="text-[#8892a4] text-sm font-medium block mb-1.5">Advertisement Image</label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={onImageSelected}
                className="w-full text-[#8892a4] text-sm"
              />
              {/* TODO: upload to backend/storage */}
            </div>
            <div>
              {form.imageBase64 ? (
                <div className="rounded-xl overflow-hidden border border-[#1e3a5f] bg-[#0a1628]">
                  <img src={form.imageBase64} alt="Preview" className="w-full h-40 object-cover" />
                </div>
              ) : (
                <div className="bg-[#0a1628] border border-[#1e3a5f] rounded-xl h-40 flex items-center justify-center text-[#8892a4]">
                  No image selected
                </div>
              )}
            </div>
          </div>

          <label className="flex items-center gap-3 text-[#cbd5e1] text-sm">
            <input
              type="checkbox"
              checked={form.postToStudentFeed}
              onChange={(e) => setField("postToStudentFeed", e.target.checked)}
              className="accent-[#f0b429]"
            />
            Post to Student Feed
          </label>

          <button
            type="button"
            onClick={submit}
            className="w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2 hover:brightness-110 transition-all"
          >
            Post Advertisement
          </button>
        </div>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-bold text-white">My Posted Ads</h2>
        <div className="mt-4">
          {myAds.length === 0 ? (
            <div className="text-[#8892a4] text-sm">You haven't posted any advertisements yet.</div>
          ) : (
            <div className="space-y-3">
              {myAds.map((ad) => (
                <div
                  key={ad.id}
                  className="flex items-start justify-between gap-4 bg-[#0a1628] border border-[#1e3a5f] rounded-xl p-4"
                >
                  <div className="min-w-0">
                    <div className="text-white font-bold truncate">{ad.title || ad.advertisementTitle}</div>
                    <div className="text-[#8892a4] text-sm mt-1">
                      {ad.company || ad.companyName} • {ad.type}
                    </div>
                    <div className="text-[#8892a4] text-xs mt-1">
                      Last Date: {ad.lastDateToApply || ad.lastDate}
                    </div>
                    <div className={`text-xs font-semibold mt-2 inline-block ${statusForAd(ad) === "Active" ? "text-[#f0b429]" : "text-[#8892a4]"}`}>
                      Status: {statusForAd(ad)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAd(ad.id)}
                    className="rounded-lg border border-red-500/40 text-red-300 px-3 py-2 text-sm hover:bg-red-500/10 transition-all duration-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

