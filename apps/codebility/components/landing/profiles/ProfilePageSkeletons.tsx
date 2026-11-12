import { Skeleton } from "@codevs/ui/skeleton";

import { ProfileSectionCard } from "@/components/landing/profiles/ProfileSectionCard";

function ChipSkeleton() {
  return <Skeleton className="h-[var(--cb-size-32)] w-[92px] rounded-[var(--cb-radius-8)]" />;
}

export function ProfileBreadcrumbSkeleton() {
  return (
    <div aria-hidden className="flex items-center gap-[var(--cb-space-8)] pt-16">
      <Skeleton className="h-4 w-12 rounded-[4px]" />
      <Skeleton className="h-4 w-4 rounded-[4px]" />
      <Skeleton className="h-4 w-28 rounded-[4px]" />
    </div>
  );
}

export function ProfileHeroSkeleton() {
  return (
    <div
      aria-hidden
      className="rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)] lg:min-h-[456px]"
    >
      <div className="grid gap-[var(--cb-space-32)] lg:grid-cols-[342px_minmax(0,1fr)] lg:gap-[44px]">
        <Skeleton className="aspect-square w-full rounded-[var(--cb-radius-16)]" />
        <div className="flex flex-col">
          <Skeleton className="h-[var(--cb-size-28)] w-[170px] rounded-[var(--cb-radius-full)]" />
          <Skeleton className="mt-[var(--cb-space-16)] h-[52px] w-[70%] rounded-[var(--cb-radius-8)]" />
          <Skeleton className="mt-[var(--cb-space-12)] h-6 w-[42%] rounded-[var(--cb-radius-8)]" />
          <Skeleton className="mt-[var(--cb-space-20)] h-4 w-full max-w-[620px] rounded-[4px]" />
          <Skeleton className="mt-[var(--cb-space-8)] h-4 w-[70%] max-w-[520px] rounded-[4px]" />
          <div className="mt-[var(--cb-space-20)] flex gap-[var(--cb-space-12)]">
            <Skeleton className="h-5 w-[240px] rounded-[4px]" />
            <Skeleton className="h-5 w-[180px] rounded-[4px]" />
          </div>
          <div className="mt-[var(--cb-space-24)] flex gap-[var(--cb-space-8)]">
            <Skeleton className="h-[44px] w-[104px] rounded-[var(--cb-radius-8)]" />
            <Skeleton className="h-[44px] w-[104px] rounded-[var(--cb-radius-8)]" />
            <Skeleton className="h-[44px] w-[104px] rounded-[var(--cb-radius-8)]" />
          </div>
          <div className="mt-[var(--cb-space-24)] flex gap-[var(--cb-space-12)]">
            <Skeleton className="h-[var(--cb-size-48)] w-[150px] rounded-[var(--cb-radius-full)]" />
            <Skeleton className="h-[var(--cb-size-48)] w-[170px] rounded-[var(--cb-radius-full)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkillsSkeleton() {
  return (
    <ProfileSectionCard>
      <div className="flex items-end justify-between">
        <Skeleton className="h-7 w-24 rounded-[4px]" />
        <Skeleton className="h-4 w-28 rounded-[4px]" />
      </div>
      <div className="mt-[var(--cb-space-24)] flex flex-col gap-[var(--cb-space-20)]">
        {[0, 1, 2].map((group) => (
          <div key={group}>
            <Skeleton className="h-3 w-20 rounded-[4px]" />
            <div className="mt-[10px] flex flex-wrap gap-[var(--cb-space-8)]">
              {Array.from({ length: group === 0 ? 7 : group === 1 ? 4 : 5 }).map(
                (_, index) => (
                  <ChipSkeleton key={index} />
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}

export function ProfileExperienceSkeleton() {
  return (
    <ProfileSectionCard>
      <div className="flex items-end justify-between">
        <Skeleton className="h-7 w-32 rounded-[4px]" />
        <Skeleton className="h-4 w-20 rounded-[4px]" />
      </div>
      <div className="mt-[var(--cb-space-20)] flex flex-col gap-[var(--cb-space-20)]">
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-[var(--cb-space-16)]">
            <Skeleton className="mt-1 h-3 w-3 shrink-0 rounded-full" />
            <div className="flex w-full flex-col gap-2">
              <Skeleton className="h-5 w-[45%] rounded-[4px]" />
              <Skeleton className="h-4 w-[38%] rounded-[4px]" />
            </div>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}

export function ProfileSidebarSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-[var(--cb-space-24)]">
      <ProfileSectionCard>
        <Skeleton className="h-7 w-36 rounded-[4px]" />
        <Skeleton className="mt-[var(--cb-space-16)] h-6 w-44 rounded-[4px]" />
        <Skeleton className="mt-[var(--cb-space-8)] h-4 w-36 rounded-[4px]" />
        <div className="mt-[var(--cb-space-20)] grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-9 rounded-[var(--cb-radius-8)]" />
          ))}
        </div>
      </ProfileSectionCard>
      <ProfileSectionCard>
        <Skeleton className="h-7 w-28 rounded-[4px]" />
        <div className="mt-[var(--cb-space-16)] flex gap-[var(--cb-space-12)]">
          <Skeleton className="h-10 w-10 shrink-0 rounded-[var(--cb-radius-8)]" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-[80%] rounded-[4px]" />
            <Skeleton className="h-4 w-[62%] rounded-[4px]" />
            <Skeleton className="h-3 w-24 rounded-[4px]" />
          </div>
        </div>
      </ProfileSectionCard>
      <ProfileSectionCard>
        <Skeleton className="h-7 w-[75%] rounded-[4px]" />
        <Skeleton className="mt-[var(--cb-space-12)] h-4 w-full rounded-[4px]" />
        <Skeleton className="mt-2 h-4 w-[80%] rounded-[4px]" />
        <Skeleton className="mt-[var(--cb-space-20)] h-[var(--cb-size-48)] w-full rounded-[var(--cb-radius-full)]" />
      </ProfileSectionCard>
    </div>
  );
}

export function ProfileProjectsSkeleton() {
  return (
    <ProfileSectionCard>
      <div className="flex items-end justify-between">
        <Skeleton className="h-7 w-48 rounded-[4px]" />
        <Skeleton className="h-4 w-16 rounded-[4px]" />
      </div>
      <div className="mt-[var(--cb-space-20)] overflow-hidden rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)]">
        <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
          <Skeleton className="aspect-[16/9] w-full rounded-none lg:aspect-auto lg:min-h-[170px]" />
          <div className="flex flex-col justify-center p-[var(--cb-space-24)]">
            <Skeleton className="h-6 w-24 rounded-[var(--cb-radius-full)]" />
            <Skeleton className="mt-[var(--cb-space-12)] h-7 w-40 rounded-[4px]" />
            <Skeleton className="mt-[var(--cb-space-16)] h-5 w-28 rounded-[4px]" />
          </div>
        </div>
      </div>
    </ProfileSectionCard>
  );
}
