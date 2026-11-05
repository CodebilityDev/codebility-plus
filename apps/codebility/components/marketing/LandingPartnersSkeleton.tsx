"use client";

import { Skeleton } from "@/components/global/ui/skeleton";

export function LandingPartnersSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-lg px-8 py-8 text-white" aria-hidden>
      <div className="mb-12 text-center">
        <h2 className="mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-center text-4xl font-extrabold text-transparent sm:text-5xl">
          Our Partners
        </h2>
        <p className="text-center text-lg text-gray-300 sm:text-xl">
          Meet Our Trusted Partners
        </p>
      </div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="relative flex h-32 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <Skeleton className="h-full w-full rounded-md bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
