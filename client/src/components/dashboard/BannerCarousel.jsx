import { useEffect, useMemo, useState } from "react";

function ArrowIcon({ direction }) {
  const isLeft = direction === "left";
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      {isLeft ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

export default function BannerCarousel({ imageSources }) {
  const candidateUrls = useMemo(() => {
    if (Array.isArray(imageSources) && imageSources.length > 0) {
      return imageSources.filter(Boolean);
    }

    // Fallback: try ad1..ad6 (skip missing ones silently).
    return Array.from({ length: 6 }, (_v, idx) => `/images/ad${idx + 1}.jpg`);
  }, [imageSources]);

  const [validImages, setValidImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const results = await Promise.all(
        candidateUrls.map(
          (src) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(src);
              img.onerror = () => resolve(null);
              img.src = src;
            })
        )
      );
      if (cancelled) return;
      const filtered = results.filter(Boolean);
      setValidImages(filtered);
      setActiveIndex(0);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [candidateUrls]);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % validImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [validImages.length]);

  if (!validImages.length) {
    return (
      <div className="w-full rounded-xl bg-[#0b1f3a] border border-[#1e3a5f] shadow-sm h-[280px] sm:h-[320px] flex items-center justify-center">
        <div className="text-[#8892a4] font-semibold text-sm sm:text-base">
          Banners coming soon
        </div>
      </div>
    );
  }

  function prev() {
    setActiveIndex((i) =>
      (i - 1 + validImages.length) % validImages.length
    );
  }

  function next() {
    setActiveIndex((i) => (i + 1) % validImages.length);
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-[#1e3a5f] shadow-sm bg-[#0b1f3a] h-[280px] sm:h-[320px]">
      <div className="absolute inset-0">
        {validImages.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Banner ${i + 1}`}
            className="absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-500"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
            onError={() => {
              // Hide broken images if any slip past the preload check.
              setValidImages((prev) => prev.filter((s) => s !== src));
            }}
          />
        ))}
      </div>

      {validImages.length > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-lg bg-black/40 hover:bg-black/55 text-white/90 hover:text-white transition-all duration-200 w-10 h-10 flex items-center justify-center"
          >
            <ArrowIcon direction="left" />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-lg bg-black/40 hover:bg-black/55 text-white/90 hover:text-white transition-all duration-200 w-10 h-10 flex items-center justify-center"
          >
            <ArrowIcon direction="right" />
          </button>
        </>
      ) : null}

      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
        {validImages.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to banner ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              i === activeIndex ? "bg-[#f0b429] scale-125" : "bg-white/70 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

