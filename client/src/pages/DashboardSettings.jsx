import { useEffect, useState } from "react";
import Toast from "../components/ui/Toast";
import api from "../services/api";

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

export default function DashboardSettings() {
  const [prefs, setPrefs] = useState({
    privacyControls: {
      showProfile: true,
      allowAlumniMessaging: true,
    },
    notificationPreferences: {
      emailOnMentorshipUpdate: true,
      weeklyDigest: false,
    },
  });

  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastTone, setToastTone] = useState("success");

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await api.get("/settings");
        if (data.data?.settings) {
          setPrefs((prev) => ({
            ...prev,
            ...data.data.settings,
          }));
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  function showToast(msg, tone = "success") {
    setToastMsg(msg);
    setToastTone(tone);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  }

  async function saveSection(sectionKey, nextSection) {
    const nextPrefs = {
      ...prefs,
      [sectionKey]: nextSection,
    };
    setPrefs(nextPrefs);
    try {
      await api.put("/settings", { settings: nextPrefs });
      showToast("Settings saved");
    } catch (err) {
      showToast("Failed to save settings", "error");
    }
  }

  async function handleDeactivate() {
    const ok = window.confirm("Are you sure you want to deactivate your student account? You will be logged out.");
    if (!ok) return;
    try {
      await api.delete("/settings/deactivate");
      window.location.href = "/login";
    } catch (err) {
      showToast("Failed to deactivate", "error");
    }
  }

  if (loading) return <div className="text-[#8892a4]">Loading settings...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Student Settings</h1>

      {/* SECTION 1 */}
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white">Privacy Controls</h2>
        <div className="mt-4 space-y-4">
          <Toggle
            label="Make my profile visible to Alumni"
            checked={prefs.privacyControls.showProfile}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                privacyControls: { ...p.privacyControls, showProfile: v },
              }))
            }
          />
          <Toggle
            label="Allow Alumni to message me directly"
            checked={prefs.privacyControls.allowAlumniMessaging}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                privacyControls: { ...p.privacyControls, allowAlumniMessaging: v },
              }))
            }
          />
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

      {/* SECTION 2 */}
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
        <div className="mt-4 space-y-4">
          <Toggle
            label="Email me when my mentorship requests are updated"
            checked={prefs.notificationPreferences.emailOnMentorshipUpdate}
            onChange={(v) =>
              setPrefs((p) => ({
                ...p,
                notificationPreferences: { ...p.notificationPreferences, emailOnMentorshipUpdate: v },
              }))
            }
          />
          <Toggle
            label="Weekly insight digest"
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
            onClick={handleDeactivate}
            className="w-full rounded-lg border border-red-500/40 text-red-300 px-4 py-2.5 text-sm font-bold hover:bg-red-500/10 transition-all duration-200"
          >
            Deactivate Account
          </button>
        </div>
      </section>

      <Toast open={toastOpen} message={toastMsg} tone={toastTone} />
    </div>
  );
}
