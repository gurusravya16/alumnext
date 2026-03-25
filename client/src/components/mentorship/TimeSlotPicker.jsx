const TIME_SLOTS = [
  { id: "10-1030", start: "10:00 AM", end: "10:30 AM" },
  { id: "11-1130", start: "11:00 AM", end: "11:30 AM" },
  { id: "2-230", start: "2:00 PM", end: "2:30 PM" },
  { id: "330-4", start: "3:30 PM", end: "4:00 PM" },
  { id: "5-530", start: "5:00 PM", end: "5:30 PM" },
];

export default function TimeSlotPicker({ selectedSlotId, onSelectSlot }) {
  return (
    <div className="space-y-4">
      <div className="text-white font-semibold text-sm">
        Available time slots
        {/* TODO: connect to backend to fetch slots for the selected date. */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TIME_SLOTS.map((slot) => {
          const active = slot.id === selectedSlotId;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                active
                  ? "border-[#f0b429] text-[#f0b429] bg-[#112240]"
                  : "border-[#1e3a5f] text-white/90 bg-[#0a1628] hover:bg-[#112240]/60 hover:brightness-110"
              }`}
            >
              <div className="text-white font-bold text-sm">
                {slot.start} – {slot.end}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

