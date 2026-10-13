"use client";

import { Skeleton } from "@/components/global/ui/skeleton";
import { WORK_WITH_US_CARDS } from "@/constants/marketing/marketing";

export function LandingWorkWithUsSkeleton() {
  return (
    <div
      className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-4 text-white md:px-6 lg:px-8"
      aria-hidden
    >
      <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center md:gap-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-purple-200">
          Work With Us
        </span>
        <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
          Build meaningful products with a partner that keeps momentum high.
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
          Whether you need a seasoned project team, specialist talent, or a
          launchpad for your own journey, Codebility brings world-class execution,
          mentorship, and community to every collaboration.
        </p>
      </div>

      <div className="mt-14 grid w-full grid-cols-1 gap-8 md:mt-20 md:grid-cols-2 md:gap-10 lg:gap-12">
        {WORK_WITH_US_CARDS.map((card, index) => (
          <div key={card.id} className="group relative w-full">
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 bg-gradient-to-br from-white/10 via-white/5 to-purple-950/20 p-6 shadow-xl backdrop-blur-md md:p-8">
              <div className="relative overflow-hidden rounded-2xl">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl bg-white/10" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-8 flex flex-col gap-6 text-white md:mt-10">
                <h3 className="text-2xl font-semibold md:text-3xl">{card.title}</h3>
                <p className="text-base leading-relaxed text-white/75 md:text-lg">
                  {card.description}
                </p>
                <div className="pt-2">
                  <div className="inline-flex h-12 items-center justify-center rounded-full bg-[#9747FF] px-6 text-lg text-white shadow-lg shadow-purple-500/20">
                    {card.linkText}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
