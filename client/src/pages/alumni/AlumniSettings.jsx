import { useEffect, useMemo, useState } from "react";
import Toast from "../../components/ui/Toast";

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 text-[#cbd5e1] text-sm">
      <span className="min-w-0">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-[#f0b429]"
      />
    </label>
  );
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export default function AlumniSettings() {
  const STORAGE = "alumnext_settings";

  const initial = useMemo(() => {
    const raw = localStorage.getItem(STORAGE);
    return raw ? safeParse(raw, {}) : {};
  }, []);

  const [prefs, setPrefs] = useState(() => ({
    mentorshipPreferences: initial.mentorshipPreferences || {
      shareEmail: true,
      sharePhone: true,
      availability: "Available",
      maxSessionsPerWeek: 3,
    },
    privacyControls: initial.privacyControls || {
      showInDirectory: true,
      showRoleCompanyPublicly: true,
      allowStudentsViewPosts: true,
      showLinkedIn: true,
    },
    notificationPreferences: initial.notificationPreferences || {
      emailOnRequest: true,
      emailOnComment: true,
      weeklyDigest: false,
    },
  }));

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    // keep in sync if storage changes later.
    // TODO: connect settings to backend.
  }, []);

  function showToast(msg) {
    setToastMsg(msg);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  }

  function saveSection(sectionKey, nextSection) {
    const next = {
      ...prefs,
      [sectionKey]: nextSection,
    };
    setPrefs(next);
    localStorage.setItem(STORAGE, JSON.stringify(next));
    showToast("Saved");
    // TODO: PATCH /api/users/settings
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      {/* SECTION 1 */}
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white">Mentorship Preferences</h2>
        <div className="mt-4 space-y-4">
          <Toggle
            label="Share Email by default"
            checked={prefs.mentorshipPreferences.shareEmail}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                mentorshipPreferences: { ...p.mentorshipPreferences, shareEmail: v },
              }))
            }
          />
          <Toggle
            label="Share Phone Number by default"
            checked={prefs.mentorshipPreferences.sharePhone}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                mentorshipPreferences: { ...p.mentorshipPreferences, sharePhone: v },
              }))
            }
          />
          <div className="text-[#8892a4] text-xs">
            You can always override this per session when accepting a request.
          </div>
          <div>
            <label className="block text-[#8892a4] text-sm font-medium mb-1.5">
              Mentorship Availability
            </label>
            <select
              value={prefs.mentorshipPreferences.availability}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  mentorshipPreferences: { ...p.mentorshipPreferences, availability: e.target.value },
                }))
              }
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            >
              <option>Available</option>
              <option>Busy (pause new requests)</option>
              <option>Not accepting requests</option>
            </select>
          </div>
          <div>
            <label className="block text-[#8892a4] text-sm font-medium mb-1.5">
              Max sessions per week
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={prefs.mentorshipPreferences.maxSessionsPerWeek}
              onChange={(e) =>
                setPrefs((p) => ({
                  ...p,
                  mentorshipPreferences: { ...p.mentorshipPreferences, maxSessionsPerWeek: Number(e.target.value) },
                }))
              }
              className="w-full rounded-lg bg-[#0a1628] border border-[#1e3a5f] px-4 py-2.5 text-white focus:outline-none focus:border-[#f0b429] transition-all duration-200"
            />
          </div>
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => saveSection("mentorshipPreferences", prefs.mentorshipPreferences)}
            className="w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* SECTION 2 */}
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white">Privacy Controls</h2>
        <div className="mt-4 space-y-4">
          <Toggle
            label="Show my profile in Alumni Directory"
            checked={prefs.privacyControls.showInDirectory}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                privacyControls: { ...p.privacyControls, showInDirectory: v },
              }))
            }
          />
          <Toggle
            label="Show my current company and role publicly"
            checked={prefs.privacyControls.showRoleCompanyPublicly}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                privacyControls: { ...p.privacyControls, showRoleCompanyPublicly: v },
              }))
            }
          />
          <Toggle
            label="Allow students to view my posts"
            checked={prefs.privacyControls.allowStudentsViewPosts}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                privacyControls: { ...p.privacyControls, allowStudentsViewPosts: v },
              }))
            }
          />
          <Toggle
            label="Show LinkedIn on my profile"
            checked={prefs.privacyControls.showLinkedIn}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                privacyControls: { ...p.privacyControls, showLinkedIn: v },
              }))
            }
          />
          <div className="text-[#8892a4] text-xs">
            Your email and phone number are never shown publicly. They are only shared with students after you explicitly confirm a mentorship session.
          </div>
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => saveSection("privacyControls", prefs.privacyControls)}
            className="w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* SECTION 3 */}
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
        <div className="mt-4 space-y-4">
          <Toggle
            label="Email me when I receive a mentorship request"
            checked={prefs.notificationPreferences.emailOnRequest}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                notificationPreferences: { ...p.notificationPreferences, emailOnRequest: v },
              }))
            }
          />
          <Toggle
            label="Email me when a student comments on my post"
            checked={prefs.notificationPreferences.emailOnComment}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                notificationPreferences: { ...p.notificationPreferences, emailOnComment: v },
              }))
            }
          />
          <Toggle
            label="Weekly digest of platform activity"
            checked={prefs.notificationPreferences.weeklyDigest}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                notificationPreferences: { ...p.notificationPreferences, weeklyDigest: v },
              }))
            }
          />
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={() => saveSection("notificationPreferences", prefs.notificationPreferences)}
            className="w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </section>

      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm border border-red-500/40">
        <h2 className="text-lg font-bold text-white">Danger Zone</h2>
        <div className="text-[#8892a4] text-sm mt-2">
          Deactivate Account
        </div>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              const ok = window.confirm("This will hide your profile from students. You can reactivate by contacting admin.");
              if (!ok) return;
              // TODO: PATCH /api/users/deactivate
            }}
            className="w-full rounded-lg border border-red-500/40 text-red-300 px-4 py-2.5 text-sm font-bold hover:bg-red-500/10 transition-all duration-200"
          >
            Deactivate Account
          </button>
        </div>
      </section>

      <Toast open={toastOpen} message={toastMsg} tone="success" />
    </div>
  );
}

