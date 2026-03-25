import { useEffect, useMemo, useState } from "react";
import StepIndicator from "./StepIndicator";
import MentorshipCalendar from "./MentorshipCalendar";
import TimeSlotPicker from "./TimeSlotPicker";

function formatFullDate(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function MentorshipBookingModal({
  open,
  alumniName,
  onClose,
  onBookedSuccess,
}) {
  const [step, setStep] = useState(1);
  const [viewMonth, setViewMonth] = useState(() => new Date().getMonth());
  const [viewYear, setViewYear] = useState(() => new Date().getFullYear());

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const selectedSlot = useMemo(() => {
    const slots = [
      { id: "10-1030", start: "10:00 AM", end: "10:30 AM" },
      { id: "11-1130", start: "11:00 AM", end: "11:30 AM" },
      { id: "2-230", start: "2:00 PM", end: "2:30 PM" },
      { id: "330-4", start: "3:30 PM", end: "4:00 PM" },
      { id: "5-530", start: "5:00 PM", end: "5:30 PM" },
    ];
    return slots.find((s) => s.id === selectedSlotId) || null;
  }, [selectedSlotId]);

  useEffect(() => {
    if (!open) return;
    // reset modal state whenever opened
    setStep(1);
    const now = new Date();
    setViewMonth(now.getMonth());
    setViewYear(now.getFullYear());
    setSelectedDate(null);
    setSelectedSlotId(null);
    setIsConfirming(false);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="bg-black/60 fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        onClick={() => onClose?.()}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-[520px] bg-[#0a1628] border border-[#1e3a5f] rounded-2xl overflow-hidden shadow-lg max-h-[85vh] flex flex-col"
      >
        <button
          type="button"
          onClick={() => onClose?.()}
          className="absolute top-3 right-3 z-[210] rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all w-9 h-9 flex items-center justify-center text-xl leading-none"
          aria-label="Close mentorship booking"
        >
          ×
        </button>

        <div className="p-5 border-b border-[#1e3a5f]">
          <StepIndicator step={step} />
        </div>

        <div className="p-5 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <div className="text-white font-bold text-lg">
                  Pick a Date
                </div>
                <div className="text-[#8892a4] text-sm mt-1">
                  Select an available date for your mentorship session.
                  {/* TODO: fetch available dates from backend */}
                </div>
              </div>

              <MentorshipCalendar
                selectedDate={selectedDate}
                viewMonth={viewMonth}
                viewYear={viewYear}
                onPrevMonth={() => {
                  const prev = new Date(viewYear, viewMonth - 1, 1);
                  setViewYear(prev.getFullYear());
                  setViewMonth(prev.getMonth());
                }}
                onNextMonth={() => {
                  const next = new Date(viewYear, viewMonth + 1, 1);
                  setViewYear(next.getFullYear());
                  setViewMonth(next.getMonth());
                }}
                onSelectDate={(d) => {
                  setSelectedDate(d);
                  // advance to step 2 once a valid date is selected
                  setStep(2);
                }}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-5">
              <div>
                <div className="text-white font-bold text-lg">
                  Pick a Time Slot
                </div>
                <div className="text-[#8892a4] text-sm mt-1">
                  Choose an available time for {alumniName}.
                  {/* TODO: fetch available slots from backend */}
                </div>
              </div>

              <TimeSlotPicker
                selectedSlotId={selectedSlotId}
                onSelectSlot={(slot) => setSelectedSlotId(slot.id)}
              />

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={!selectedSlotId}
                  onClick={() => setStep(3)}
                  className={`w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200 ${
                    selectedSlotId ? "" : "opacity-60 cursor-not-allowed hover:brightness-100"
                  }`}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full rounded-lg border border-[#f0b429]/40 bg-transparent text-[#f0b429] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
                >
                  Back
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-5">
              <div>
                <div className="text-white font-bold text-lg">
                  Confirm Booking
                </div>
                <div className="text-[#8892a4] text-sm mt-1">
                  Review details before sending your request.
                </div>
              </div>

              <div className="bg-[#112240] border border-[#1e3a5f] rounded-xl p-4">
                <div className="text-white font-semibold">
                  You are booking a mentorship session with:
                </div>
                <div className="text-[#f0b429] font-bold mt-1">
                  {alumniName}
                </div>

                <div className="mt-4 space-y-2 text-[#cbd5e1] text-sm">
                  <div>
                    <span className="text-[#8892a4]">Date:</span>{" "}
                    <span className="font-semibold">
                      {selectedDate ? formatFullDate(selectedDate) : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8892a4]">Time:</span>{" "}
                    <span className="font-semibold">
                      {selectedSlot ? `${selectedSlot.start} – ${selectedSlot.end}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isConfirming}
                  onClick={async () => {
                    setIsConfirming(true);
                    // TODO: POST /api/mentorship/book
                    await new Promise((r) => setTimeout(r, 1500));
                    setIsConfirming(false);
                    onClose?.();
                    onBookedSuccess?.();
                  }}
                  className={`w-full rounded-lg bg-[#f0b429] text-[#0a1628] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200 flex items-center justify-center ${
                    isConfirming ? "opacity-90 cursor-not-allowed" : ""
                  }`}
                >
                  {isConfirming ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-full border-2 border-[#0a1628] border-t-transparent animate-spin"
                        aria-hidden="true"
                      />
                      Confirming…
                    </span>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full rounded-lg border border-[#f0b429]/40 bg-transparent text-[#f0b429] font-bold px-4 py-2.5 hover:brightness-110 transition-all duration-200"
                >
                  Back
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

