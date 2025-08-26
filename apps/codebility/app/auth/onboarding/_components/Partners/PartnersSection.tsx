"use client";

import React, { useEffect, useRef, useState } from "react";

// Simple in-view hook (no 3rd‑party libs)
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
      },
      { threshold: 0.2 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// Dummy logo (inline SVG so no assets required)
function DummyLogo({
  label = "LOGO",
  hue = 200,
}: {
  label?: string;
  hue?: number;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className="h-12 w-28"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`g-${hue}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue}, 80%, 60%)`} />
          <stop
            offset="100%"
            stopColor={`hsl(${(hue + 60) % 360}, 80%, 55%)`}
          />
        </linearGradient>
      </defs>
      <rect
        x="8"
        y="28"
        width="104"
        height="64"
        rx="14"
        fill={`url(#g-${hue})`}
        opacity="0.25"
      />
      <circle cx="40" cy="60" r="20" fill={`url(#g-${hue})`} />
      <rect
        x="64"
        y="44"
        width="32"
        height="32"
        rx="8"
        fill={`url(#g-${hue})`}
      />
    </svg>
  );
}

type Partner = { id: string; hue: number; alt: string };

const PARTNERS: Partner[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `partner-${i + 1}`, // ✅ unique keys
  hue: (i * 28) % 360,
  alt: `Partner ${i + 1}`,
}));

export default function PartnersSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#0b0f12]">
      {/* subtle diagonal glow matching your dark motif */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_600px_at_85%_20%,rgba(244,63,94,0.25),transparent_60%),radial-gradient(900px_500px_at_10%_80%,rgba(20,184,166,0.25),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <h2
          className={`bg-gradient-to-r from-slate-100 via-white to-slate-300 bg-clip-text text-center
            text-3xl font-extrabold tracking-tight text-transparent transition-all duration-700
            sm:text-4xl md:text-5xl ${inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
        >
          Our Partners
        </h2>

        <p
          className={`mx-auto mt-3 max-w-2xl text-center text-sm text-slate-400 transition-opacity
            delay-100 duration-700 sm:text-base ${inView ? "opacity-100" : "opacity-0"}`}
        >
          Collaborating with forward‑thinking teams to build great products.
        </p>

        <div
          className={`mt-12 grid grid-cols-2 gap-4 transition-all duration-700 sm:grid-cols-3
            md:grid-cols-4 lg:grid-cols-6 ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          {PARTNERS.map((p) => (
            <div
              key={p.id}
              className="group relative flex items-center justify-center rounded-2xl bg-white/5 px-4 py-6
                         ring-1 ring-white/10 backdrop-blur transition-all duration-300 hover:bg-white/10
                         hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] hover:ring-white/20"
            >
              <div className="absolute inset-px rounded-2xl bg-gradient-to-br from-white/5 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <DummyLogo hue={p.hue} label={p.alt} />
            </div>
          ))}
        </div>

        {/* bottom divider accent */}
        <div className="mx-auto mt-14 h-px w-40 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    </section>
  );
}
