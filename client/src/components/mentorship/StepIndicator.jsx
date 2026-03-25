function StepCircle({ state, label }) {
  const base =
    "w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200";

  if (state === "completed") {
    return (
      <div
        className={`${base} bg-[#f0b429] border-[#f0b429] text-[#0a1628]`}
        aria-label={`Step ${label} completed`}
      >
        <span aria-hidden="true">✓</span>
      </div>
    );
  }

  if (state === "active") {
    return (
      <div
        className={`${base} bg-[#f0b429] border-[#f0b429] text-[#0a1628]`}
        aria-label={`Step ${label} active`}
      >
        <span className="font-bold" aria-hidden="true">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${base} bg-[#1e3a5f] border-[#1e3a5f] text-[#8892a4]`}
      aria-label={`Step ${label}`}
    >
      <span className="font-bold" aria-hidden="true">
        {label}
      </span>
    </div>
  );
}

export default function StepIndicator({ step }) {
  // step: 1..3
  return (
    <div className="flex items-center w-full">
      <StepCircle
        state={step > 1 ? "completed" : step === 1 ? "active" : "future"}
        label={1}
      />
      <div className="h-[2px] flex-1 bg-[#1e3a5f]" />
      <StepCircle
        state={step > 2 ? "completed" : step === 2 ? "active" : "future"}
        label={2}
      />
      <div className="h-[2px] flex-1 bg-[#1e3a5f]" />
      <StepCircle
        state={step === 3 ? "active" : step > 3 ? "completed" : "future"}
        label={3}
      />
    </div>
  );
}

