function initialsFromName(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "??";
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function OpeningCard({ ad, onApply }) {
  const company = ad?.company || "";
  const title = ad?.title || ad?.advertisementTitle || "";
  const typeRaw = String(ad?.type || ad?.adType || "");
  const typeLower = typeRaw.toLowerCase();
  const location = ad?.location || "";
  const lastDate = ad?.lastDateToApply || ad?.lastDate || "";
  const badgeIsFullTime = typeLower.includes("full");

  const badgeClass = badgeIsFullTime
    ? "bg-[#f0b429] text-[#0a1628] border border-[#f0b429]/40"
    : "bg-[#0B1F3A] text-[#f0b429] border border-[#1e3a5f]";

  const initials = initialsFromName(company || title);

  let formattedLastDate = "";
  if (lastDate) {
    const dt = new Date(lastDate);
    if (!Number.isNaN(dt.getTime())) {
      formattedLastDate = dt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  return (
    <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="h-12 w-12 rounded-full bg-[#f0b429]/15 border border-[#f0b429]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#f0b429] font-bold text-sm">
              {initials}
            </span>
          </div>

          <div className="min-w-0">
            <div className="text-white font-bold text-base truncate">
              {title || "Untitled Opening"}
            </div>
            <div className="text-[#8892a4] text-sm mt-1 truncate">
              {company}
            </div>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
                {badgeIsFullTime ? "Full-Time" : "Internship"}
              </span>
              {location ? (
                <span className="text-[#8892a4] text-xs">📍 {location}</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="text-[#8892a4] text-xs">
          Last date: {formattedLastDate || "—"}
        </div>
        <button
          type="button"
          onClick={() => onApply?.(ad)}
          className="rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 text-sm hover:brightness-110 transition-all duration-200"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

