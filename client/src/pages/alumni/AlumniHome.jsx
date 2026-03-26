import { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import BannerCarousel from "../../components/dashboard/BannerCarousel";
import DashboardAlumni from "../DashboardAlumni";
import {
  MegaphoneIcon,
  BriefcaseIcon,
  FileTextIcon,
  UsersIcon,
} from "../../components/ui/OutlineIcons";

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
    : dt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function AlumniHome() {
  const { user } = useAuth();
  const name = user?.name || "Alumni";

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

  const activeAds = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    return (Array.isArray(ads) ? ads : []).filter((ad) => {
      if (ad?.postToStudentFeed !== true) return false;
      const lastDateToApply = ad?.lastDateToApply || ad?.lastDate;
      if (!lastDateToApply) return true;
      const dt = new Date(lastDateToApply);
      if (Number.isNaN(dt.getTime())) return true;
      const t = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
      return t >= startOfToday;
    });
  }, [ads]);

  const carouselImages = useMemo(() => {
    const images = activeAds
      .map((ad) => ad?.adImageBase64 || ad?.adImageData || ad?.adImageDataUri || ad?.adImage)
      .filter(Boolean);
    return images.length ? images : undefined;
  }, [activeAds]);

  const activity = useMemo(
    () => [
      {
        id: "a1",
        text: "You posted a new job opening — Software Engineer Intern",
        date: "2026-03-01",
      },
      { id: "a2", text: "You shared a new alumni update post", date: "2026-03-10" },
      { id: "a3", text: "New student joined the network", date: "2026-03-18" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Welcome back, {name}</h1>
        <p className="text-[#8892a4] mt-2">
          {/** TODO: fetch alumni profile data like current role/company */}
          Current role: Alumni · Company: Company
        </p>
      </section>

      {/* College Updates */}
      <section className="space-y-5">
        <BannerCarousel imageSources={carouselImages} />

        <div className="space-y-4">
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
        </div>
      </section>

      {/* Quick stats */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-[#8892a4] text-sm font-medium">
                  Advertisements Posted
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <FileTextIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">18</div>
                <div className="text-[#8892a4] text-sm font-medium">Posts shared</div>
              </div>
            </div>
          </div>
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">1,240</div>
                <div className="text-[#8892a4] text-sm font-medium">
                  Connected alumni
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        <div className="space-y-3">
          {activity.map((item) => (
            <div
              key={item.id}
              className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between gap-4"
            >
              <div className="text-white text-sm">{item.text}</div>
              <div className="text-[#8892a4] text-xs whitespace-nowrap">
                {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alumni Network (same directory UI as students) */}
      <div className="pt-2">
        <DashboardAlumni />
      </div>
    </div>
  );
}

