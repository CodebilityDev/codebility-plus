import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Skeleton } from "@codevs/ui/skeleton";

import { Button } from "@/components/global/design-system/Button";
import { HireTalentCard } from "@/components/landing/hire-a-codev/HireTalentCard";
import { HireTalentFilterBar } from "@/components/landing/hire-a-codev/HireTalentFilterBar";
import { HireTalentFilters } from "@/components/landing/hire-a-codev/HireTalentFilters";
import { HireTalentTechBar } from "@/components/landing/hire-a-codev/HireTalentTechBar";
import { HireTalentTechFilters } from "@/components/landing/hire-a-codev/HireTalentTechFilters";
import {
  HireTalentCardsFrame,
  HireTalentTransition,
} from "@/components/landing/hire-a-codev/HireTalentTransition";
import {
  normalizeHireTalentFilter,
  normalizeHireTalentTech,
} from "@/constants/landing/hire-a-codev/content";
import { getCachedHireTalentProfiles } from "@/lib/landing/hire-a-codev/data";

interface HireTalentBrowserProps {
  searchParams: Promise<{
    filter?: string | string[];
    tech?: string | string[];
  }>;
}

function HireTalentCardsSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading available talent"
      className="mt-[var(--cb-space-32)] grid w-full grid-cols-1 gap-[var(--cb-space-12)] sm:grid-cols-2 xl:grid-cols-4"
    >
      <span className="sr-only">Loading available talent</span>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[#0B0B0D]"
        >
          <div className="aspect-square w-full overflow-hidden border-b border-[color:var(--cb-border)] bg-[#151515]">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          <div className="flex flex-1 flex-col p-[var(--cb-space-12)]">
            <Skeleton className="h-5 w-2/3 rounded-[4px]" />
            <Skeleton className="mt-[var(--cb-space-2)] h-[18px] w-1/2 rounded-[4px]" />
            <div className="mt-[var(--cb-space-12)] flex gap-[var(--cb-space-6)]">
              <Skeleton className="h-6 w-16 rounded-[6px]" />
              <Skeleton className="h-6 w-16 rounded-[6px]" />
              <Skeleton className="h-6 w-16 rounded-[6px]" />
            </div>
          </div>
          <Skeleton className="h-[var(--cb-size-44)] w-full rounded-none border-t border-[color:var(--cb-border)]" />
        </div>
      ))}
    </div>
  );
}

async function HireTalentCards({ searchParams }: HireTalentBrowserProps) {
  const params = await searchParams;
  const activeFilter = normalizeHireTalentFilter(params.filter);
  const activeTech = normalizeHireTalentTech(params.tech);
  const profiles = await getCachedHireTalentProfiles(activeFilter, activeTech);

  if (profiles.length === 0) {
    return (
      <p className="mt-[var(--cb-space-32)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
        No CoDevs match this filter yet.
      </p>
    );
  }

  return (
    <div className="mt-[var(--cb-space-32)] grid w-full grid-cols-1 gap-[var(--cb-space-12)] sm:grid-cols-2 xl:grid-cols-4">
      {profiles.map((profile) => (
        <HireTalentCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}

export function HireTalentBrowser({ searchParams }: HireTalentBrowserProps) {
  return (
    <HireTalentTransition>
      <div className="mt-[var(--cb-space-32)] flex flex-col items-center">
        <Suspense fallback={<HireTalentFilterBar activeFilter="all" />}>
          <HireTalentFilters />
        </Suspense>

        <Suspense fallback={<HireTalentCardsSkeleton />}>
          <HireTalentCardsFrame fallback={<HireTalentCardsSkeleton />}>
            <HireTalentCards searchParams={searchParams} />
          </HireTalentCardsFrame>
        </Suspense>

        <Suspense fallback={<HireTalentTechBar activeFilter="all" />}>
          <HireTalentTechFilters />
        </Suspense>

        <Button asChild variant="outline" className="mt-[var(--cb-space-24)]">
          <Link href="/codevs">
            View all CoDevs
            <ArrowRight
              aria-hidden
              className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
            />
          </Link>
        </Button>
      </div>
    </HireTalentTransition>
  );
}
