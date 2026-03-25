import { useEffect, useState } from "react";

const MESSAGE =
  "Booking request sent! A confirmation will be sent to your registered email. Please wait for the alumni to confirm your session.";

export default function MentorshipSuccessToast({ open, onClose }) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (!open) return;
    setVisible(true);
    const t = setTimeout(() => {
      onClose?.();
    }, 6000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  useEffect(() => {
    if (open) return;
    setVisible(false);
  }, [open]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes mentorshipToastIn {
          from { transform: translateX(24px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <div
        className="fixed bottom-6 right-6 z-[200] w-[340px] max-w-[calc(100vw-2rem)]"
        style={{ animation: "mentorshipToastIn 450ms ease-out" }}
      >
        <div className="bg-[#112240] border border-[#1e3a5f] border-l-4 border-[#f0b429] text-white rounded-xl px-4 py-3 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm leading-relaxed">
              {MESSAGE}
            </div>
            <button
              type="button"
              onClick={() => onClose?.()}
              className="rounded-lg bg-white/5 text-white/90 hover:bg-white/10 px-2 py-1 text-sm leading-none transition-all"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

