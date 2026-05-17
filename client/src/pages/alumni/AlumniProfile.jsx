import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
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

  const [fullName, setFullName] = useState(user?.name || "");
  const [graduationYear, setGraduationYear] = useState("2020");
  const [branch, setBranch] = useState("CSE");
  const [bio, setBio] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [industry, setIndustry] = useState("Software");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");

  const [loading, setLoading] = useState(true);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.id) return;
      try {
        const { data } = await api.get(`/users/${user.id}`);
        if (cancelled) return;
        const profile = data.data.user;
        setFullName(profile.name || "");
        setGraduationYear(profile.year ? String(profile.year) : "2020");
        setBranch(profile.branch || "CSE");
        setBio(profile.bio || "");
        setLinkedInUrl(profile.linkedin || "");
        setPhotoBase64(profile.profileImage || "");
        // Other alumni-specific fields could be set if they were added to schema.
        // For now, using default values for company, jobTitle, industry, phone.
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user?.id]);

  function onPhotoSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setPhotoBase64(result);
      setPhotoBase64(result);
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    try {
      const payload = {
        name: fullName.trim(),
        bio,
        linkedin: linkedInUrl.trim(),
        profileImage: photoBase64,
        // We omit graduationYear, branch, etc as they aren't fully integrated in put Profile payload yet.
      };

      await api.put("/users/profile", payload);

      updateUserName(payload.name);

      setSuccessOpen(true);
      setTimeout(() => setSuccessOpen(false), 3000);
    } catch (err) {
      console.error("Failed to save alumni profile", err);
    }
  }

  if (loading) return <div className="text-white">Loading profile...</div>;

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
              Or paste an Image URL below
            </div>
            <input
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={photoBase64}
              onChange={(e) => setPhotoBase64(e.target.value)}
              className="mt-2 w-full max-w-[200px] text-xs rounded border border-[#1e3a5f] bg-[#0a1628] px-2 py-1 text-white focus:outline-none focus:border-[#f0b429]"
            />
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

