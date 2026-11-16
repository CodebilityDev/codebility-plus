"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { loadPortfolioPage } from "@/actions/landing/services/portfolio";
import { PortfolioGridSkeleton } from "@/components/landing/services/PortfolioGridSkeleton";
import { PortfolioProjectCard } from "@/components/landing/services/PortfolioProjectCard";
import {
  portfolioBrowse,
  portfolioHref,
} from "@/constants/landing/services/content";
import type {
  PortfolioCategoryId,
  PortfolioProject,
} from "@/types/landing/services/portfolio";

interface PortfolioInfiniteGridProps {
  initialProjects: PortfolioProject[];
  initialTotal: number;
  category: PortfolioCategoryId;
  search: string;
  pageSize: number;
}

interface CachedPage {
  projects: PortfolioProject[];
  total: number;
}

export function PortfolioInfiniteGrid({
  initialProjects,
  initialTotal,
  category,
  search,
  pageSize,
}: PortfolioInfiniteGridProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const pageCache = useRef(
    new Map<number, CachedPage>([
      [0, { projects: initialProjects, total: initialTotal }],
    ]),
  );
  const hasMore = projects.length < total;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || projects.length >= total) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const offset = projects.length;
    const cached = pageCache.current.get(offset);

    try {
      const page =
        cached ??
        (await loadPortfolioPage({
          category,
          search,
          offset,
          limit: pageSize,
        }));

      if (!cached) pageCache.current.set(offset, page);

      setProjects((current) => {
        const existing = new Set(current.map((project) => project.id));
        const additions = page.projects.filter(
          (project) => !existing.has(project.id),
        );

        return additions.length > 0 ? [...current, ...additions] : current;
      });
      setTotal(page.total);
    } catch {
      setError(portfolioBrowse.loadError);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [category, pageSize, projects.length, search, total]);

  useEffect(() => {
    const node = sentinelRef.current;

    if (!node || !hasMore || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMore();
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [error, hasMore, loadMore]);

  return (
    <div className="flex w-full flex-col items-center gap-[var(--cb-space-32)]">
      <div className="grid w-full grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <PortfolioProjectCard
            key={project.id}
            project={project}
            href={portfolioHref({
              category,
              search,
              project: project.id,
            })}
          />
        ))}
      </div>

      {loading ? (
        <div className="w-full">
          <PortfolioGridSkeleton count={3} />
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-[var(--cb-space-12)]"
        >
          <p className="text-sm leading-5 text-[color:var(--cb-text-muted)]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              void loadMore();
            }}
            className="inline-flex h-[var(--cb-size-40)] items-center justify-center rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] px-[var(--cb-space-20)] text-sm font-medium text-[color:var(--cb-text)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
          >
            {portfolioBrowse.retry}
          </button>
        </div>
      ) : null}

      <div
        ref={sentinelRef}
        aria-hidden
        className="h-px w-full"
      />

      <div
        aria-hidden
        className="h-[2px] w-[240px] overflow-hidden rounded-[var(--cb-radius-full)] bg-[#1C1C1C]"
      >
        <div
          className="h-full rounded-[var(--cb-radius-full)] bg-[color:var(--cb-primary)] transition-[width] duration-300"
          style={{ width: `${(projects.length / total) * 100}%` }}
        />
      </div>
      <p
        aria-live="polite"
        className="text-xs leading-4 text-[color:var(--cb-text-muted)]"
      >
        {portfolioBrowse.showingLabel} {projects.length} of {total}{" "}
        {total === 1 ? portfolioBrowse.projectOne : portfolioBrowse.projectMany}
      </p>
    </div>
  );
}
