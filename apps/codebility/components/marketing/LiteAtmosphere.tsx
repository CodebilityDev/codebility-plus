"use client";

export function LiteAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden
    >
      <div
        className="absolute left-1/4 top-1/3 h-24 w-24 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 71, 255, 0.25) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 h-20 w-20 rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(2, 255, 226, 0.2) 0%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
    </div>
  );
}
