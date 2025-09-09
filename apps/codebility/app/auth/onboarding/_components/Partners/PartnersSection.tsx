"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Simple in-view hook (no 3rd-party libs)
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

type Partner = { id: string; src: string; alt: string };

const PARTNERS: Partner[] = [
  { id: "ai", src: "/assets/images/partners/ai.png", alt: "AI" },
  { id: "averps", src: "/assets/images/partners/averps.png", alt: "AVERPS" },
  {
    id: "bradwell",
    src: "/assets/images/partners/bradwell.png",
    alt: "Bradwell",
  },
  {
    id: "federal-plans",
    src: "/assets/images/partners/federal-plans.png",
    alt: "Federal Plans",
  },
  {
    id: "fixflow-ai",
    src: "/assets/images/partners/fixflow-ai.png",
    alt: "FixFlow AI",
  },
  {
    id: "genius-web-services",
    src: "/assets/images/partners/genius-web-services.png",
    alt: "Genius Web Services",
  },
  {
    id: "infraspan",
    src: "/assets/images/partners/infraspan.png",
    alt: "Infraspan",
  },
  {
    id: "netmedia",
    src: "/assets/images/partners/netmedia.png",
    alt: "Netmedia",
  },
  {
    id: "tolle-design",
    src: "/assets/images/partners/tolle-design.png",
    alt: "Tolle Design",
  },
  {
    id: "travel-tribe",
    src: "/assets/images/partners/travel-tribe.png",
    alt: "Travel Tribe",
  },
  {
    id: "web-divine",
    src: "/assets/images/partners/web-divine.png",
    alt: "Web Divine",
  },
  {
    id: "zwift-tech",
    src: "/assets/images/partners/zwift-tech.png",
    alt: "Zwift Tech",
  },
];

export default function PartnersSection() {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100"
    >
      {/* soft pastel glows for light motif */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_520px_at_85%_20%,rgba(236,72,153,0.15),transparent_60%),radial-gradient(800px_480px_at_10%_80%,rgba(20,184,166,0.15),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:py-28">
        <h2
          className={`bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-center
            text-3xl font-extrabold tracking-tight text-transparent transition-all duration-700
            sm:text-4xl md:text-5xl ${inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
        >
          Our Partners
        </h2>

        <p
          className={`mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 transition-opacity
            delay-100 duration-700 sm:text-base ${inView ? "opacity-100" : "opacity-0"}`}
        >
          Collaborating with forward-thinking teams to build great products.
        </p>

        <div
          className={`mt-12 grid grid-cols-2 gap-4 transition-all duration-700 sm:grid-cols-3
            md:grid-cols-4 lg:grid-cols-6 ${inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        >
          {PARTNERS.map((p) => (
            <div
              key={p.id}
              className="group relative flex items-center justify-center rounded-2xl
             bg-slate-800 px-4 py-6 shadow-sm ring-1 ring-slate-900/30
             backdrop-blur-sm transition-all duration-300
             hover:bg-slate-800/90 hover:shadow-[0_10px_30px_-12px_rgba(2,6,23,0.35)] hover:ring-slate-900/50"
              title={p.alt}
            >
              {/* subtle inner highlight on hover */}
              <div
                className="absolute inset-px rounded-2xl bg-gradient-to-br from-white/10 to-white/0
               opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <Image
                src={p.src}
                alt={p.alt}
                width={160}
                height={64}
                className="relative z-[1] h-12 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* bottom divider accent */}
        <div className="mx-auto mt-14 h-px w-40 rounded-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>
    </section>
  );
}
