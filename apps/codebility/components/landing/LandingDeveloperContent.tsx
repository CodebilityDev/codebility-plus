import { Suspense } from "react";

import { HeroMarquee } from "@/components/landing/HeroMarquee";
import { LandingSearchCardsSkeleton } from "@/components/landing/LandingSearchCardsSkeleton";
import { LandingSearchResults } from "@/components/landing/LandingSearchResults";
import type {
  HeroCodev,
  LandingSearchParams,
} from "@/types/landing/hero-codevs";

interface LandingDeveloperContentProps {
  codevs: HeroCodev[];
  searchParams: LandingSearchParams;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePage(value: string | string[] | undefined): number {
  const parsed = Number(firstParam(value));

  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
}

async function LandingDeveloperContent({
  codevs,
  searchParams,
}: LandingDeveloperContentProps) {
  const params = await searchParams;
  const query = (firstParam(params.search) ?? "").trim();

  if (!query) return <HeroMarquee codevs={codevs} />;

  return (
    <Suspense fallback={<LandingSearchCardsSkeleton />}>
      <LandingSearchResults query={query} page={parsePage(params.page)} />
    </Suspense>
  );
}

export { LandingDeveloperContent };
