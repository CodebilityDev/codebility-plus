"use client";

import dynamic from "next/dynamic";

const PartnersSection = dynamic(() => import("./_components/Partners/PartnersSection"), {
  ssr: false,
  loading: () => (
    <section className="w-full bg-[#0b0f12] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-white/10" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-20 rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </div>
    </section>
  ),
});

export default function PartnersSectionWrapper() {
  return <PartnersSection />;
}
