import { Suspense } from "react";

import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { PortfolioFilters, PortfolioFilterList } from "@/components/landing/services/PortfolioFilters";
import { PortfolioGridSkeleton } from "@/components/landing/services/PortfolioGridSkeleton";
import { PortfolioInfiniteGrid } from "@/components/landing/services/PortfolioInfiniteGrid";
import { PortfolioSearch, PortfolioSearchFallback } from "@/components/landing/services/PortfolioSearch";
import {
  PortfolioCardsFrame,
  PortfolioTransition,
} from "@/components/landing/services/PortfolioTransition";
import {
  normalizePortfolioCategory,
  portfolioBrowse,
  portfolioPageSize,
} from "@/constants/landing/services/content";
import { getCachedPortfolioPage } from "@/lib/landing/services/data";

interface PortfolioBrowserProps {
  searchParams: Promise<{
    category?: string | string[];
    search?: string | string[];
  }>;
}

function normalizeSearch(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function PortfolioGrid({ searchParams }: PortfolioBrowserProps) {
  const params = await searchParams;
  const category = normalizePortfolioCategory(params.category);
  const search = normalizeSearch(params.search);
  const page = await getCachedPortfolioPage(
    category,
    search,
    0,
    portfolioPageSize,
  );

  if (page.projects.length === 0) {
    return (
      <p className="py-[var(--cb-space-40)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
        {portfolioBrowse.empty}
      </p>
    );
  }

  return (
    <PortfolioInfiniteGrid
      key={`${category}:${search}`}
      initialProjects={page.projects}
      initialTotal={page.total}
      category={category}
      search={search}
      pageSize={portfolioPageSize}
    />
  );
}

export function PortfolioBrowser({ searchParams }: PortfolioBrowserProps) {
  return (
    <section
      id="projects"
      className="relative border-t border-[color:var(--cb-border)] py-[7rem]"
    >
      <LandingContainer>
        <PortfolioTransition>
          <div className="flex flex-col gap-[var(--cb-space-32)]">
            <div className="flex flex-col gap-[var(--cb-space-20)] lg:flex-row lg:items-end lg:justify-between">
              <SectionHeader
                eyebrow={portfolioBrowse.eyebrow}
                title={portfolioBrowse.title}
              />
              <Suspense fallback={<PortfolioSearchFallback />}>
                <PortfolioSearch />
              </Suspense>
            </div>

            <div className="grid gap-[var(--cb-space-24)] lg:grid-cols-[283px_minmax(0,1fr)] lg:gap-[var(--cb-space-28)]">
              <aside className="lg:sticky lg:top-[var(--cb-space-96)] lg:self-start">
                <Suspense
                  fallback={<PortfolioFilterList active="all" />}
                >
                  <PortfolioFilters />
                </Suspense>
              </aside>

              <div className="min-w-0" id="portfolio-grid">
                <Suspense fallback={<PortfolioGridSkeleton />}>
                  <PortfolioCardsFrame fallback={<PortfolioGridSkeleton />}>
                    <PortfolioGrid searchParams={searchParams} />
                  </PortfolioCardsFrame>
                </Suspense>
              </div>
            </div>
          </div>
        </PortfolioTransition>
      </LandingContainer>
    </section>
  );
}
