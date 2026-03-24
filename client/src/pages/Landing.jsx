import { useEffect } from "react";
import { Link } from "react-router-dom";

const logoImg = "/images/logo.png";
const logoFallback = "/images/logo.jpg";

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
    image: "/images/t&p.jpg",
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
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={logoImg}
              alt="AlumNext"
              className="h-9 w-9 rounded-full object-cover border border-[#D4AF37]/30"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = logoFallback;
              }}
            />
            <span className="text-base font-semibold text-white">AlumNext</span>
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

      {/* Hero - scenic background like reference */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: "url('/images/hero-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F3A]/90 via-[#0B1F3A]/70 to-[#0B1F3A]" />
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

      {/* Features - For Students, T&P, Alumni - styled like reference cards */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#D4AF37]/20 bg-[#0A192F]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.08)_0%,_transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white text-center mb-4">
            Transform Your Career Journey
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Tailored solutions for every role in your institution&apos;s network
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {FEATURE_CARDS.map((card) => (
              <Link
                key={card.id}
                to={card.href}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8 hover:border-[#D4AF37]/30 hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="aspect-[16/10] rounded-xl overflow-hidden mb-6 bg-[#0B1F3A]/50">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/hero-bg.png";
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-white border-b border-[#D4AF37]/40 pb-2 inline-block">
                  {card.title}
                </h3>
                <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                  {card.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[#D4AF37] font-medium text-sm group-hover:gap-3 transition-all">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
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
