import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AnimatedOval from "./AnimatedOval";

import "./oval.css";

function ArrowRightIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg
      className="oval-icon oval-icon--student"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 10c13.5 0 24.5 6 24.5 13.5S45.5 37 32 37 7.5 31 7.5 23.5 18.5 10 32 10Z"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="2"
      />
      <path
        d="M12 27v13c0 7.5 11 13.5 20 13.5s20-6 20-13.5V27"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="2"
      />
      <path
        d="M26 46l-4-4 4-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="oval-icon__chev"
      />
      <circle cx="44" cy="42" r="4" className="oval-icon__pulseDot" fill="currentColor" />
    </svg>
  );
}

function AlumniIcon() {
  return (
    <svg
      className="oval-icon oval-icon--alumni"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 28c3-6 7-9 12-9s9 3 12 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M18 44c4-3 8-4.5 14-4.5S42 41 46 44"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="44" r="3" fill="currentColor" className="oval-icon__travelDot" />
      <path d="M20 44L44 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
    </svg>
  );
}

function TpIcon() {
  return (
    <svg
      className="oval-icon oval-icon--tp"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 48V22c0-2.2 1.8-4 4-4h28c2.2 0 4 1.8 4 4v26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M20 44V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="oval-icon__bar oval-icon__bar--1" />
      <path d="M32 44V22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="oval-icon__bar oval-icon__bar--2" />
      <path d="M44 44V32" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="oval-icon__bar oval-icon__bar--3" />
      <circle cx="48" cy="20" r="4" fill="currentColor" className="oval-icon__pulseDot" />
    </svg>
  );
}

function getVariantIcon(id) {
  const v = String(id || "").toLowerCase();
  if (v.includes("student")) return <StudentIcon />;
  if (v.includes("alumni")) return <AlumniIcon />;
  return <TpIcon />;
}

export default function OvalCard({
  id,
  title,
  description,
  href,
  isActive,
  index = 0,
}) {
  const cardRef = useRef(null);

  // Load animation only on mount.
  const delayMs = index * 120;
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--cardAnimDelay", `${delayMs}ms`);
  }, [delayMs]);

  return (
    <Link
      ref={cardRef}
      to={href}
      className={`ovalCard3D ${
        isActive ? "ovalCard3D--active" : "ovalCard3D--inactive"
      }`}
      style={{ "--cardScale": isActive ? 1.08 : 0.88 }}
    >
      <div className="ovalCard-inner">
        <AnimatedOval variant={id} icon={getVariantIcon(id)} />

        <div className="relative px-6 pb-8">
          <div className="oval-titleWrap">
            <h3 className="oval-title">{title}</h3>
          </div>
          <p className="oval-description">{description}</p>

          <div className="mt-6 inline-flex items-center gap-2 text-[#D4AF37] font-semibold text-sm">
            Learn more
            <ArrowRightIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

