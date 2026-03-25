import { useEffect, useMemo, useState } from "react";

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatMonthYear(view) {
  return view.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function MentorshipCalendar({
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  viewMonth,
  viewYear,
}) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const availableDates = useMemo(() => {
    const seed = viewYear * 100 + viewMonth;
    const rand = mulberry32(seed);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    // TODO: fetch available dates from backend for the alumni's mentorship calendar.
    const count = 8 + Math.floor(rand() * 5); // 8–12
    const chosen = new Set();
    while (chosen.size < count) {
      const day = 1 + Math.floor(rand() * daysInMonth);
      chosen.add(day);
    }
    return chosen;
  }, [viewMonth, viewYear]);

  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewMonth, viewYear]
  );

  const firstDay = useMemo(() => new Date(viewYear, viewMonth, 1), [viewMonth, viewYear]);
  const firstWeekday = firstDay.getDay(); // 0=Sun

  const gridCells = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(viewYear, viewMonth, day));
    }
    // pad to complete weeks
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [firstWeekday, daysInMonth, viewMonth, viewYear]);

  const monthLabel = useMemo(() => formatMonthYear(new Date(viewYear, viewMonth, 1)), [viewMonth, viewYear]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-white font-bold text-lg">{monthLabel}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevMonth}
            className="w-9 h-9 rounded-lg bg-white/5 border border-[#1e3a5f] text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="w-9 h-9 rounded-lg bg-white/5 border border-[#1e3a5f] text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-xs text-[#8892a4]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {gridCells.map((d, idx) => {
          if (!d) {
            return <div key={idx} className="h-10" />;
          }

          const isPast = startOfDay(d).getTime() < today.getTime();
          const isToday = startOfDay(d).getTime() === today.getTime();
          const isAvailable = availableDates.has(d.getDate());
          const isSelectable = isAvailable && !isPast;

          const isSelected =
            selectedDate &&
            startOfDay(d).getTime() === startOfDay(selectedDate).getTime();

          const cellBase =
            "h-10 rounded-lg border flex items-center justify-center text-sm transition-all duration-200 relative";

          let classes = `${cellBase} ${
            isSelected
              ? "bg-[#f0b429] border-[#f0b429] text-[#0a1628] font-bold z-10"
              : isSelectable
                ? "bg-white/10 border-[#f0b429] text-white cursor-pointer hover:bg-[#f0b429] hover:text-[#0a1628]"
                : "bg-[#0a1628] border-[#1e3a5f] text-[#3a4a5c] cursor-not-allowed"
          }`;

          return (
            <button
              key={idx}
              type="button"
              className={classes}
              disabled={!isSelectable}
              onClick={() => {
                if (!isSelectable) return;
                onSelectDate(d);
              }}
              aria-label={
                isSelectable ? `Select ${d.toDateString()}` : `Unavailable ${d.toDateString()}`
              }
            >
              <span>{d.getDate()}</span>
              {isToday && !isSelected ? (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#f0b429]" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

