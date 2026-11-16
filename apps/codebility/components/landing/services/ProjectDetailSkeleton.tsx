import { Skeleton } from "@codevs/ui/skeleton";

import { LandingContainer } from "@/components/global/layout/LandingContainer";

export function ProjectDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading project">
      <span className="sr-only">Loading project</span>
      <section className="relative overflow-hidden pb-[var(--cb-space-64)] pt-[var(--cb-space-40)] sm:pt-[var(--cb-space-48)] lg:pb-[var(--cb-space-80)]">
        <LandingContainer>
          <Skeleton className="h-4 w-56 rounded-[4px]" />
          <div className="mt-[var(--cb-space-24)] flex flex-col gap-[var(--cb-space-24)] lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full max-w-[760px]">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="mt-[var(--cb-space-16)] h-16 w-2/3 rounded-[6px]" />
              <Skeleton className="mt-[var(--cb-space-16)] h-5 w-full rounded-[4px]" />
              <Skeleton className="mt-[var(--cb-space-8)] h-5 w-4/5 rounded-[4px]" />
            </div>
            <Skeleton className="h-10 w-64 rounded-full" />
          </div>
          <Skeleton className="mt-[var(--cb-space-32)] aspect-[2.35/1] w-full rounded-[var(--cb-radius-24)]" />
          <div className="mt-[var(--cb-space-16)] grid grid-cols-2 gap-0 border-y border-[color:var(--cb-border)] md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="py-[var(--cb-space-24)]">
                <Skeleton className="h-3 w-16 rounded-[4px]" />
                <Skeleton className="mt-[var(--cb-space-8)] h-5 w-3/4 rounded-[4px]" />
              </div>
            ))}
          </div>
        </LandingContainer>
      </section>

      <section className="border-t border-[color:var(--cb-border)] py-[7rem]">
        <LandingContainer className="grid gap-[var(--cb-space-40)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div>
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="mt-[var(--cb-space-16)] h-11 w-4/5 rounded-[6px]" />
            <Skeleton className="mt-[var(--cb-space-12)] h-5 w-full rounded-[4px]" />
          </div>
          <div className="grid gap-[var(--cb-space-16)] sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[170px] rounded-[var(--cb-radius-16)]"
              />
            ))}
          </div>
        </LandingContainer>
      </section>

      <section className="border-t border-[color:var(--cb-border)] py-[7rem]">
        <LandingContainer>
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="mt-[var(--cb-space-16)] h-11 w-1/2 rounded-[6px]" />
          <Skeleton className="mt-[var(--cb-space-32)] h-[540px] w-full rounded-[var(--cb-radius-24)]" />
        </LandingContainer>
      </section>
    </div>
  );
}
