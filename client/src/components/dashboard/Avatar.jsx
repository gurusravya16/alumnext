export default function Avatar({ name, src, size = 44 }) {
  const initials =
    typeof name === "string" && name.trim().length > 0
      ? name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("")
      : "A";

  const style = { width: size, height: size };

  return (
    <div
      className="rounded-full overflow-hidden bg-[#f0b429]/15 border border-[#f0b429]/30 flex items-center justify-center"
      style={style}
      aria-label={`${name || "Avatar"} avatar`}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-[#f0b429] font-bold text-sm">{initials}</span>
      )}
    </div>
  );
}

