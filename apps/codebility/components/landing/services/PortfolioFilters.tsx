"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { MouseEvent } from "react";
import {
  ArrowRight,
  ChevronRight,
  Globe2,
  LayoutGrid,
  PenTool,
  ShoppingBag,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { usePortfolioNavigate } from "@/components/landing/services/PortfolioTransition";
import {
  normalizePortfolioCategory,
  portfolioBrowse,
  portfolioCategories,
  portfolioCategoryCounts,
  portfolioHref,
} from "@/constants/landing/services/content";
import type { PortfolioCategoryId } from "@/types/landing/services/portfolio";

const categoryIcons: Record<string, LucideIcon> = {
  grid: LayoutGrid,
  globe: Globe2,
  store: ShoppingBag,
  mobile: Smartphone,
  pen: PenTool,
  sparkles: Sparkles,
};

export function PortfolioFilterList({
  active,
  search = "",
  onNavigate,
}: {
  active: PortfolioCategoryId;
  search?: string;
  onNavigate?: (href: string) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-[var(--cb-space-8)]">
      {portfolioCategories.map((category) => {
        const Icon = categoryIcons[category.icon] ?? LayoutGrid;
        const selected = category.id === active;
        const href = portfolioHref({
          category: category.id,
          search: search || undefined,
        });

        return (
          <Link
            key={category.id}
            href={href}
            prefetch={false}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              if (!onNavigate) return;
              event.preventDefault();
              onNavigate(href);
            }}
            aria-current={selected ? "page" : undefined}
            className={
              "flex min-h-[48px] items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-12)] border px-[var(--cb-space-16)] text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] " +
              (selected
                ? "border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] bg-[linear-gradient(90deg,color-mix(in_srgb,var(--cb-primary)_18%,transparent),transparent)] text-[color:var(--cb-text)]"
                : "border-[color:#1E1E1E] bg-[#0F0F0F] text-[color:var(--cb-text-secondary)] hover:border-[color:color-mix(in_srgb,var(--cb-primary)_30%,transparent)] hover:text-[color:var(--cb-text)]")
            }
          >
            <Icon
              aria-hidden
              className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 text-[color:var(--cb-p300)]"
            />
            <span className="min-w-0 flex-1 truncate">{category.label}</span>
            <span className="text-[13px] tabular-nums text-[color:var(--cb-text-muted)]">
              {portfolioCategoryCounts[category.id]}
            </span>
            <ChevronRight
              aria-hidden
              className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0 text-[color:var(--cb-text-muted)]"
            />
          </Link>
        );
      })}

      <div className="mt-[var(--cb-space-8)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--cb-primary)_15%,#0B0B0D),#0B0B0D)] p-[var(--cb-space-20)]">
        <p className="text-lg font-semibold leading-6 text-[color:var(--cb-text)]">
          {portfolioBrowse.sidebarTitle}
        </p>
        <p className="mt-[var(--cb-space-8)] text-sm leading-[21px] text-[color:var(--cb-text-muted)]">
          {portfolioBrowse.sidebarDescription}
        </p>
        <Link
          href="/bookacall"
          className="mt-[var(--cb-space-16)] inline-flex items-center gap-[var(--cb-space-6)] rounded-[var(--cb-radius-full)] bg-[color:var(--cb-primary)] px-[var(--cb-space-12)] py-[var(--cb-space-8)] text-xs font-medium leading-4 text-[color:var(--cb-text)] transition-colors hover:bg-[color:var(--cb-primary-hover)]"
        >
          {portfolioBrowse.sidebarCta}
          <ArrowRight
            aria-hidden
            className="h-[var(--cb-size-14)] w-[var(--cb-size-14)]"
          />
        </Link>
      </div>
    </div>
  );
}

export function PortfolioFilters() {
  const searchParams = useSearchParams();
  const navigate = usePortfolioNavigate();

  return (
    <PortfolioFilterList
      active={normalizePortfolioCategory(searchParams.get("category"))}
      search={searchParams.get("search") ?? ""}
      onNavigate={navigate}
    />
  );
}
