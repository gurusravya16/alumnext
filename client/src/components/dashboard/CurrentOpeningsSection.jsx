import { useMemo, useState } from "react";
import OpeningCard from "./OpeningCard";

export default function CurrentOpeningsSection({ ads, onApplyNow }) {
  const [filter, setFilter] = useState("All");

  const activeAds = useMemo(() => Array.isArray(ads) ? ads : [], [ads]);

  const filtered = useMemo(() => {
    if (!activeAds.length) return [];
    if (filter === "All") return activeAds;

    return activeAds.filter((ad) => {
      const typeLower = String(ad?.type || ad?.adType || "").toLowerCase();
      if (filter === "Internship") return typeLower.includes("intern");
      if (filter === "Full-Time") return typeLower.includes("full");
      return true;
    });
  }, [activeAds, filter]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold text-white">Current Openings</h2>
          <p className="text-[#8892a4] text-sm mt-1">
            Explore active internships and job opportunities
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setFilter("All")}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200 ${
              filter === "All"
                ? "bg-[#f0b429] text-[#0a1628] border-[#f0b429]"
                : "bg-transparent border-[#1e3a5f] text-[#8892a4] hover:border-[#f0b429]/40"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("Internship")}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200 ${
              filter === "Internship"
                ? "bg-[#f0b429] text-[#0a1628] border-[#f0b429]"
                : "bg-transparent border-[#1e3a5f] text-[#8892a4] hover:border-[#f0b429]/40"
            }`}
          >
            Internship
          </button>
          <button
            type="button"
            onClick={() => setFilter("Full-Time")}
            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-200 ${
              filter === "Full-Time"
                ? "bg-[#f0b429] text-[#0a1628] border-[#f0b429]"
                : "bg-transparent border-[#1e3a5f] text-[#8892a4] hover:border-[#f0b429]/40"
            }`}
          >
            Full-Time
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-10 text-center">
          <div className="text-white font-semibold">
            No active job openings at the moment.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((ad) => (
            <OpeningCard key={ad?.id || ad?.title} ad={ad} onApply={onApplyNow} />
          ))}
        </div>
      )}
    </section>
  );
}

