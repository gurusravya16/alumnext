import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const logoImg = "/images/logo.jpg";

const FEATURE_CARDS = [
  {
    id: "students",
    title: "For Students",
    description: "Connect with verified alumni, book mentorship sessions, and access curated career opportunities.",
    image: "/images/student.jpg",
    href: "/signup/student",
  },
  {
    id: "tp",
    title: "For T&P",
    description: "Verify alumni, moderate postings, and monitor placement analytics across your institution.",
    image: "/images/tp.jpg",
    href: "/signup",
  },
  {
    id: "alumni",
    title: "For Alumni",
    description: "Post opportunities, offer mentorship, and expand your professional network.",
    image: "/images/alumni.jpg",
    href: "/signup/alumni",
  },
];

export default function Landing() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex((i) => (i + 1) % FEATURE_CARDS.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + FEATURE_CARDS.length) % FEATURE_CARDS.length);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      className="min-h-screen bg-[#0B1F3A] text-gray-100 antialiased"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* Floating glassmorphism nav */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl">
        <nav className="rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-lg px-4 py-2.5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logoImg}
              alt="AlumNext"
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-[#D4AF37]/40 shadow-lg"
            />
            <span className="text-lg sm:text-xl font-semibold text-white">AlumNext</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Login as Student
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
            >
              Login as Alumni
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-[#D4AF37] text-[#0B1F3A] text-sm font-semibold px-5 py-2 hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero - hero image as full background */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/75 via-[#0B1F3A]/50 to-[#0B1F3A]/90" />
        <div className="absolute top-1/2 right-0 w-1/2 h-3/4 bg-[#D4AF37]/5 rounded-l-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto w-full z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Unlock growth with every connection
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed">
              Bridging students and alumni for career growth. Run mentorship, access verified opportunities, and automate placement success.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="rounded-xl bg-[#D4AF37] text-[#0B1F3A] font-semibold px-8 py-3.5 shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:scale-[1.02] transition-all duration-300 inline-block"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 font-medium text-gray-200 hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 inline-block"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features - carousel with one active card, next/prev */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/20 bg-[#0A192F] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-[radial-gradient(ellipse_at_bottom,_rgba(212,175,55,0.06)_0%,_transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4">
            Transform Your Career Journey
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Tailored solutions for every role in your institution&apos;s network
          </p>

          {/* Cover Flow carousel: center card large + full image, sides visible and smaller */}
          <div className="relative flex items-center justify-center min-h-[480px] sm:min-h-[520px]">
            <button
              onClick={goPrev}
              aria-label="Previous"
              className="absolute left-0 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-[#D4AF37]/50 transition-all shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="overflow-hidden w-full max-w-4xl mx-auto px-4">
              <div
                className="flex gap-8 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(50% - ${activeIndex * 412 + 190}px))`,
                }}
              >
                {FEATURE_CARDS.map((card, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <div
                      key={card.id}
                      className="flex-shrink-0 w-[380px] flex justify-center"
                    >
                      <Link
                        to={card.href}
                        className={`block w-full rounded-3xl border overflow-hidden transition-all duration-500 origin-center ${
                          isActive
                            ? "scale-100 border-[#D4AF37]/50 bg-black/70 shadow-[0_0_60px_rgba(212,175,55,0.2)] z-10"
                            : "scale-[0.82] opacity-50 border-white/10 bg-black/50 hover:opacity-70"
                        }`}
                      >
                        <div className="relative p-6 sm:p-8">
                          <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/25 via-transparent to-transparent pointer-events-none" />
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-[#0B1F3A]/80 flex items-center justify-center">
                            <img
                              src={card.image}
                              alt={card.title}
                              className={`w-full h-full ${isActive ? "object-contain" : "object-cover"}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/hero.jpg";
                              }}
                            />
                          </div>
                          <h3 className="text-xl font-bold text-white border-b border-[#D4AF37]/40 pb-2 inline-block">
                            {card.title}
                          </h3>
                          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                            {card.description}
                          </p>
                          <span className="mt-6 inline-flex items-center gap-2 text-[#D4AF37] font-medium text-sm">
                            Learn more
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={goNext}
              aria-label="Next"
              className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-[#D4AF37]/50 transition-all shrink-0"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-10">
            {FEATURE_CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === activeIndex ? "bg-[#D4AF37] scale-125" : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#D4AF37]/30 bg-[#0B1F3A] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AlumNext. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
