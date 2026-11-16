import { Skeleton } from "@codevs/ui/skeleton";

import { LandingContainer } from "@/components/global/layout/LandingContainer";

export function ServicesFeaturedSkeleton() {
  return (
    <section className="pb-[var(--cb-space-64)] sm:pb-[var(--cb-space-80)] lg:pb-[var(--cb-space-96)]">
      <LandingContainer className="flex flex-col gap-[var(--cb-space-16)]">
        <div className="overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="flex flex-col gap-[var(--cb-space-24)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)] lg:p-[var(--cb-space-40)]">
              <div className="flex gap-[var(--cb-space-12)]">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
              <Skeleton className="h-10 w-2/3 rounded-[6px]" />
              <Skeleton className="h-5 w-full rounded-[4px]" />
              <Skeleton className="h-5 w-4/5 rounded-[4px]" />
              <div className="grid gap-[var(--cb-space-16)] sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-14 w-full rounded-[8px]" />
                ))}
              </div>
              <div className="flex gap-[var(--cb-space-12)]">
                <Skeleton className="h-10 w-32 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
            <Skeleton className="min-h-[420px] rounded-none lg:min-h-[470px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[238px] rounded-[var(--cb-radius-16)]"
            />
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

export function ServicesProofSkeleton() {
  return (
    <section className="border-t border-[color:var(--cb-border)] py-[7rem]">
      <LandingContainer>
        <Skeleton className="h-7 w-36 rounded-full" />
        <Skeleton className="mt-[var(--cb-space-16)] h-11 w-2/3 rounded-[6px]" />
        <Skeleton className="mt-[var(--cb-space-12)] h-5 w-2/3 rounded-[4px]" />
        <div className="mt-[var(--cb-space-32)] grid gap-[var(--cb-space-16)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="grid grid-cols-2 gap-[var(--cb-space-16)]">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[170px] rounded-[var(--cb-radius-16)]"
              />
            ))}
          </div>
          <Skeleton className="min-h-[375px] rounded-[var(--cb-radius-24)]" />
        </div>
      </LandingContainer>
    </section>
  );
}

export function ServicesCtaSkeleton() {
  return (
    <section className="border-t border-[color:var(--cb-border)] py-[7rem]">
      <LandingContainer>
        <Skeleton className="min-h-[445px] rounded-[var(--cb-radius-24)]" />
      </LandingContainer>
    </section>
  );
}
