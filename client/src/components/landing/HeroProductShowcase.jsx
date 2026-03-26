import { useEffect, useRef } from "react";
import "./hero-showcase.css";

function StatBlock({ label, value, tone = "gold" }) {
  return (
    <div className="heroStat">
      <div className={`heroStat-value ${tone === "blue" ? "heroStat-value--blue" : ""}`}>{value}</div>
      <div className="heroStat-label">{label}</div>
    </div>
  );
}

function ProfileChip({ name, role }) {
  const initials = String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="heroChip">
      <div className="heroChip-avatar">{initials || "AN"}</div>
      <div className="min-w-0">
        <div className="heroChip-name">{name}</div>
        <div className="heroChip-role">{role}</div>
      </div>
    </div>
  );
}

export default function HeroProductShowcase() {
  const rootRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty("--px", "50%");
    el.style.setProperty("--py", "45%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  function onMouseMove(e) {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty("--px", `${x.toFixed(1)}%`);
      el.style.setProperty("--py", `${y.toFixed(1)}%`);
      el.style.setProperty("--rx", `${(-dy * 4).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(dx * 6).toFixed(2)}deg`);
    });
  }

  function onMouseLeave() {
    const el = rootRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.setProperty("--px", "50%");
    el.style.setProperty("--py", "45%");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="heroShowcase-wrap">
      <div className="heroBackGlow" aria-hidden="true" />
      <div ref={rootRef} className="heroShowcase" onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
        <div className="heroLight" aria-hidden="true" />

        <div className="heroMainPanel">
          <div className="heroPanel-header">
            <div className="heroPanel-title">AlumNext Dashboard</div>
            <div className="heroPanel-tag">Live Network</div>
          </div>

          <div className="heroStatsRow">
            <StatBlock label="Placements" value="92%" />
            <StatBlock label="Active Alumni" value="1,240" tone="blue" />
            <StatBlock label="Mentorships" value="86" />
          </div>

          <div className="heroGraph">
            <svg viewBox="0 0 300 120" className="heroGraph-svg" aria-hidden="true">
              <path d="M16 90 C 40 70, 68 78, 95 52 S 155 36, 182 58 S 238 90, 284 44" />
              <circle cx="16" cy="90" r="4" />
              <circle cx="95" cy="52" r="4" />
              <circle cx="182" cy="58" r="4" />
              <circle cx="284" cy="44" r="4" />
            </svg>
          </div>
        </div>

        <div className="heroFloatCard heroFloatCard--left">
          <div className="heroFloatTitle">Students</div>
          <ProfileChip name="Ananya R" role="B.Tech · CSE" />
          <ProfileChip name="Rahul K" role="Intern · Backend" />
        </div>

        <div className="heroFloatCard heroFloatCard--right">
          <div className="heroFloatTitle">Alumni</div>
          <ProfileChip name="Neha S" role="SDE II · Google" />
          <ProfileChip name="Arjun M" role="Data Scientist" />
        </div>
      </div>
    </div>
  );
}

