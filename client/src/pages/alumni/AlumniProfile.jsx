import { useMemo, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../../components/dashboard/Avatar";

const INDUSTRIES = ["Software", "Finance", "Research", "Healthcare", "Education", "Other"];
const BRANCHES = ["CSE", "ECE", "ME", "CE", "IT", "EE"];
const BATCH_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function AlumniProfile() {
  const { user, updateUserName } = useAuth();
  const fileRef = useRef(null);

  const initial = useMemo(() => {
    const raw = localStorage.getItem("alumnext_alumni_profile");
    return safeParse(raw, {});
  }, []);

  const [fullName, setFullName] = useState(initial?.fullName || user?.name || "");
  const [graduationYear, setGraduationYear] = useState(initial?.graduationYear || "2020");
  const [branch, setBranch] = useState(initial?.branch || "CSE");
  const [bio, setBio] = useState(initial?.bio || "");

  const [company, setCompany] = useState(initial?.company || "");
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle || "");
  const [industry, setIndustry] = useState(initial?.industry || "Software");
  const [linkedInUrl, setLinkedInUrl] = useState(initial?.linkedInUrl || "");
  const [phone, setPhone] = useState(initial?.phone || "");

  const [photoBase64, setPhotoBase64] = useState(() => {
    const raw = localStorage.getItem("alumnext_alumni_photo");
    return raw ? String(raw) : null;
  });

  const [successOpen, setSuccessOpen] = useState(false);

  function onPhotoSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setPhotoBase64(result);
      // TODO: backend upload
      localStorage.setItem("alumnext_alumni_photo", result);
    };
    reader.readAsDataURL(file);
  }

  function save() {
    const payload = {
      fullName: fullName.trim(),
      graduationYear,
      branch,
      bio,
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      industry,
      linkedInUrl: linkedInUrl.trim(),
      phone: phone.trim(),
    };

    localStorage.setItem("alumnext_alumni_profile", JSON.stringify(payload));

    // Update sidebar name reactively.
    updateUserName(payload.fullName);

    // TODO: PATCH /api/users/profile
    setSuccessOpen(true);
    setTimeout(() => setSuccessOpen(false), 3000);
  }

  const bioCount = bio.length;
  const bioMax = 300;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Alumni Profile</h1>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-5 flex-wrap">
          <Avatar name={fullName || "Alumni"} src={photoBase64 || undefined} size={96} />
          <div className="flex-1 min-w-[220px]">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoSelected}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-[#f0b429]/40 bg-transparent text-[#f0b429] px-4 py-2.5 text-sm font-bold hover:bg-[#f0b429]/10 transition-all duration-200"
            >
              Change Photo
            </button>
            <div className="text-[#8892a4] text-xs mt-2">
              TODO: backend upload
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Full Name
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Email
            </label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white opacity-70 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Graduation Year
            </label>
            <select
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            >
              {BATCH_YEARS.map((y) => (
                <option key={y} value={y} className="bg-[#0a1628]">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            >
              {BRANCHES.map((b) => (
                <option key={b} value={b} className="bg-[#0a1628]">
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Bio / About
              <span className="float-right text-[#8892a4] text-xs">
                {bioCount}/{bioMax}
              </span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, bioMax))}
              maxLength={bioMax}
              rows={4}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200 resize-y"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white">Professional Details</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Current Company
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Current Role / Job Title
            </label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            >
              {INDUSTRIES.map((i) => (
                <option key={i} value={i} className="bg-[#0a1628]">
                  {i}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              LinkedIn URL
            </label>
            <input
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Phone Number (used for mentorship contact sharing)
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        className="w-full max-w-md rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
      >
        Save Changes
      </button>

      {successOpen ? (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#112240] border border-[#1e3a5f] border-l-4 border-[#f0b429] text-white rounded-xl px-4 py-3 shadow-lg">
          Profile updated!
          {/** TODO: connect to backend in Sprint  ? */}
        </div>
      ) : null}
    </div>
  );
}

