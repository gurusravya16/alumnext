import { useMemo, useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import BannerCarousel from "../../components/dashboard/BannerCarousel";
import AnnouncementsSection from "../../components/dashboard/AnnouncementsSection";
import {
  MegaphoneIcon,
  BriefcaseIcon,
  FileTextIcon,
  UsersIcon,
} from "../../components/ui/OutlineIcons";

export default function AlumniHome() {
  const { user } = useAuth();
  const name = user?.name || "Alumni";

  const [ads, setAds] = useState([]);
  
  useEffect(() => {
    async function fetchAds() {
      try {
        const { data } = await api.get("/ads");
        setAds(data.data.ads || []);
      } catch (err) {
        console.error("Failed to fetch ads", err);
      }
    }
    fetchAds();
  }, []);

  const [activity, setActivity] = useState([]);
  useEffect(() => {
    async function fetchActivity() {
      try {
        const { data } = await api.get("/activity/me");
        if (data?.data?.activity) {
          setActivity(data.data.activity);
        }
      } catch (err) {
        console.error("Failed to load activity", err);
      }
    }
    fetchActivity();
  }, []);

  const [stats, setStats] = useState({ adsCount: 0, postsCount: 0, alumniCount: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await api.get("/stats/dashboard");
        if (data?.data) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    fetchStats();
  }, []);

  const activeAds = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    return (Array.isArray(ads) ? ads : []).filter((ad) => {
      const lastDateToApply = ad?.lastDate;
      if (!lastDateToApply) return true;
      const dt = new Date(lastDateToApply);
      if (Number.isNaN(dt.getTime())) return true;
      const t = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
      return t >= startOfToday;
    });
  }, [ads]);

  const carouselImages = useMemo(() => {
    const images = activeAds
      .map((ad) => ad?.imageUrl)
      .filter(Boolean);
    return images.length ? images : undefined;
  }, [activeAds]);

  return (
    <div className="space-y-6">
      <section className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Welcome back, {name}!</h1>
      </section>

      {/* College Updates */}
      <section className="space-y-5">
        <BannerCarousel imageSources={carouselImages} />
        <AnnouncementsSection />
      </section>

      {/* Quick stats */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.adsCount}</div>
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
                <div className="text-2xl font-bold text-white">{stats.postsCount}</div>
                <div className="text-[#8892a4] text-sm font-medium">Posts shared</div>
              </div>
            </div>
          </div>
          <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3">
              <UsersIcon className="w-6 h-6 text-[#f0b429]" />
              <div>
                <div className="text-2xl font-bold text-white">{stats.alumniCount}</div>
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
          {activity.length === 0 ? (
            <div className="text-[#8892a4] text-sm">No recent activity.</div>
          ) : (
            activity.map((item) => (
              <div
                key={item.id}
                className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-start justify-between gap-4"
              >
                <div className="text-white text-sm">{item.text}</div>
                <div className="text-[#8892a4] text-xs whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
