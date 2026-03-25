import { useEffect } from "react";

export default function Modal({ open, title, children, onClose }) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onClose?.()}
      />
      <div className="relative w-full max-w-lg rounded-xl bg-[#112240] border border-[#1e3a5f] shadow-lg overflow-hidden">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-[#1e3a5f]">
          <h3 className="text-white font-semibold">{title}</h3>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="rounded-lg bg-white/5 text-white px-3 py-1.5 hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            Close
          </button>
        </div>
        <div className="p-4 text-[#cbd5e1]">{children}</div>
      </div>
    </div>
  );
}

