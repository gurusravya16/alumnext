export default function Toast({ open, message, tone = "success" }) {
  if (!open) return null;

  const toneClasses =
    tone === "error"
      ? "bg-red-500/15 border-red-500/30 text-red-200"
      : "bg-[#22c55e]/15 border-[#22c55e]/30 text-[#bbf7d0]";

  return (
    <div
      className={`fixed z-[120] top-4 left-1/2 -translate-x-1/2 px-4 py-3 rounded-xl border ${toneClasses} shadow-lg`}
      role="status"
      aria-live="polite"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

