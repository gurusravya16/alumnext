import { useMemo } from "react";
import BannerCarousel from "../components/dashboard/BannerCarousel";
import CurrentOpeningsSection from "../components/dashboard/CurrentOpeningsSection";
import {
  BriefcaseIcon,
  CalendarIcon,
  GraduationCapIcon,
  MegaphoneIcon,
} from "../components/ui/OutlineIcons";

const collegeAnnouncements = [
  {
    title: "Career Cell Weekly Update",
    message:
      "New mock interviews schedule is live. Register using the alumni referral link.",
    datePosted: "2026-02-01",
  },
  {
    title: "Workshop on Resume Building",
    message:
      "A practical workshop focused on ATS-friendly resumes and LinkedIn optimization.",
    datePosted: "2026-02-12",
  },
  {
    title: "Mentorship Spotlight",
    message:
      "Meet the alumni mentoring committee and learn how to request sessions.",
    datePosted: "2026-02-18",
  },
];

function formatDate(d) {
  const dt = new Date(d);
  return Number.isNaN(dt.getTime())
    ? ""
    : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardHome() {
  // TODO: GET /api/advertisements when backend is ready.
  const ads = useMemo(() => {
    try {
      const raw = localStorage.getItem("alumnext_ads");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const today = useMemo(() => new Date(), []);
  const startOfToday = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime(),
    [today]
  );

  const activeAds = useMemo(() => {
    return (Array.isArray(ads) ? ads : []).filter((ad) => {
      if (ad?.postToStudentFeed !== true) return false;
      const lastDateToApply = ad?.lastDateToApply || ad?.lastDate;
      if (!lastDateToApply) return true;
      const dt = new Date(lastDateToApply);
      if (Number.isNaN(dt.getTime())) return true;
      const t = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
      return t >= startOfToday;
    });
  }, [ads, startOfToday]);

  const carouselImages = useMemo(() => {
    const images = activeAds
      .map((ad) => ad?.adImageBase64 || ad?.adImageData || ad?.adImageDataUri || ad?.adImage)
      .filter(Boolean);

    // If localStorage ads provide images, use them. Otherwise BannerCarousel falls back to ad1..ad6.
    return images.length ? images : undefined;
  }, [activeAds]);

  function applyNow(ad) {
    const apply = ad?.applyLinkOrEmail || ad?.apply || "";
    if (!apply) return;

    if (String(apply).toLowerCase().startsWith("http")) {
      window.open(apply, "_blank", "noopener,noreferrer");
      return;
    }

    // If it's an email address, copy it.
    navigator.clipboard
      ?.writeText(String(apply))
      .catch(() => {
        // Fallback: prompt (best effort) without crashing.
        try {
          window.prompt("Copy email:", String(apply));
        } catch {
          // ignore
        }
      });
  }

  return (
    <div className="space-y-6">
      {/* Job Openings Banner */}
      <section className="w-full">
        <BannerCarousel imageSources={carouselImages} />
      </section>

      {/* Quick Stats */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <GraduationCapIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">1,240</div>
                <div className="text-[#8892a4] text-sm font-medium">
                  Total Alumni in Network
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">86</div>
                <div className="text-[#8892a4] text-sm font-medium">
                  Mentorship Sessions Booked
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-[#8892a4] text-sm font-medium">
                  Active Job Openings
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CurrentOpeningsSection ads={activeAds} onApplyNow={applyNow} />

      {/* College Announcements */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <MegaphoneIcon className="w-6 h-6 text-[#f0b429]" />
          <h2 className="text-xl font-bold text-white">From the College</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {collegeAnnouncements.map((a, idx) => (
            <div
              key={`${a.title}-${idx}`}
              className="min-w-[320px] bg-[#112240] border border-[#1e3a5f] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-[6px] bg-[#0a1628] rounded-full" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-white font-semibold">{a.title}</h3>
                    <p className="text-[#8892a4] text-xs whitespace-nowrap">
                      {formatDate(a.datePosted)}
                    </p>
                  </div>
                  <p className="mt-2 text-[#cbd5e1] text-sm leading-relaxed">
                    {a.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

