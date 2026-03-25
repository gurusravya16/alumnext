import { useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/dashboard/Avatar";
import Toast from "../components/ui/Toast";

const BRANCHES = ["CSE", "ECE", "ME", "CE", "IT", "CS", "EE"];
const BATCH_YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
const STATUS_OPTIONS = ["Student", "Intern", "Placed"];

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function DashboardProfile() {
  const { user, updateUserName } = useAuth();
  const fileRef = useRef(null);

  const initial = useMemo(() => {
    const raw = localStorage.getItem("alumnext_student_profile");
    return safeParse(raw, {});
  }, []);

  const [fullName, setFullName] = useState(initial?.fullName || user?.name || "");
  const [batchYear, setBatchYear] = useState(initial?.batchYear || "2020");
  const [branch, setBranch] = useState(initial?.branch || "CSE");
  const [bio, setBio] = useState(initial?.bio || "");
  const [status, setStatus] = useState(initial?.status || "Student");
  const [companyName, setCompanyName] = useState(initial?.companyName || "");
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle || "");
  const [startDate, setStartDate] = useState(initial?.startDate || "");

  const [photoBase64, setPhotoBase64] = useState(() => {
    const raw = localStorage.getItem("alumnext_student_photo");
    return raw ? String(raw) : null;
  });

  const [toastOpen, setToastOpen] = useState(false);

  const bioCount = bio.length;
  const bioMax = 300;
  const showInternPlaced = status === "Intern" || status === "Placed";

  function openFilePicker() {
    fileRef.current?.click();
  }

  function onPhotoSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      setPhotoBase64(result);
      // TODO: connect to backend upload for real persistence.
      localStorage.setItem("alumnext_student_photo", result);
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    // TODO: connect profile save to backend in Sprint 4.
    const payload = {
      fullName: fullName.trim(),
      batchYear,
      branch,
      bio,
      status,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      startDate,
    };
    localStorage.setItem("alumnext_student_profile", JSON.stringify(payload));

    // TODO: PATCH /api/users/profile
    updateUserName(payload.fullName);

    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-[#8892a4] mt-1 text-sm">
          Manage your student profile details
        </p>

        {/* Photo */}
        <div className="mt-5 flex items-center gap-5">
          <Avatar
            name={fullName || user?.name || "Student"}
            src={photoBase64 || undefined}
            size={80}
          />
          <div className="flex flex-col gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoSelected}
            />
            <button
              type="button"
              onClick={openFilePicker}
              className="rounded-lg border border-[#f0b429]/50 bg-transparent px-4 py-2.5 text-sm font-bold text-[#f0b429] hover:bg-[#f0b429]/10 transition-all duration-200"
            >
              Change Photo
            </button>
            <div className="text-xs text-[#8892a4]">
              Stored locally for now
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              Batch Year
            </label>
            <select
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
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
              Bio / About Me
              <span className="float-right text-[#8892a4] text-xs">
                {bioCount}/{bioMax}
              </span>
            </label>
            <textarea
              value={bio}
              maxLength={bioMax}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200 resize-y"
            />
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
              Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-[#0a1628]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {showInternPlaced ? (
            <>
              <div>
                <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
                  Company Name
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
                  Role / Job Title
                </label>
                <input
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#8892a4] mb-1.5">
                  Start Date
                </label>
                <input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            className="w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
          >
            Save Profile
          </button>
        </div>
      </div>

      <Toast open={toastOpen} message="Profile updated successfully!" />
    </div>
  );
}

