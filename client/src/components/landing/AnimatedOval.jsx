import { useEffect, useRef } from "react";

export default function AnimatedOval({
  variant = "students",
  icon,
  ariaLabel = "Animated oval",
  sizeClassName = "h-[170px] sm:h-[190px]",
}) {
  const rootRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // Set defaults so the light effect doesn't look broken on first render.
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "30%");
    el.style.setProperty("--tiltX", "0deg");
    el.style.setProperty("--tiltY", "0deg");
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
      el.style.setProperty("--mx", `${x.toFixed(2)}%`);
      el.style.setProperty("--my", `${y.toFixed(2)}%`);

      // Subtle 3D tilt to avoid nausea.
      el.style.setProperty("--tiltX", `${(-dy * 5).toFixed(2)}deg`);
      el.style.setProperty("--tiltY", `${(dx * 6).toFixed(2)}deg`);
    });
  }

  function onMouseLeave() {
    const el = rootRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `30%`);
    el.style.setProperty("--tiltX", `0deg`);
    el.style.setProperty("--tiltY", `0deg`);
  }

  return (
    <div className={`relative w-full flex items-center justify-center ${sizeClassName}`}>
      <div
        ref={rootRef}
        role="img"
        aria-label={ariaLabel}
        data-variant={variant}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="oval-root"
      >
        <div className="oval-ring" aria-hidden="true" />
        <div className="oval-surface">
          <div className="oval-light" aria-hidden="true" />

          <div className="oval-iconWrap" aria-hidden="false">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

