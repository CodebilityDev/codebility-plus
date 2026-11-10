"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

import { hireTalentFilters } from "@/constants/landing/hire-a-codev/content";
import type {
  HireTalentFilterValue,
  HireTalentTech,
} from "@/constants/landing/hire-a-codev/content";

function filterHref(
  filter: HireTalentFilterValue,
  tech?: HireTalentTech,
) {
  const params = new URLSearchParams();

  if (filter !== "all") params.set("filter", filter);
  if (tech) params.set("tech", tech);

  const query = params.toString();
  return `/hire-a-codev${query ? `?${query}` : ""}#talent`;
}

export function HireTalentFilterBar({
  activeFilter,
  activeTech,
  onNavigate,
}: {
  activeFilter: HireTalentFilterValue;
  activeTech?: HireTalentTech;
  onNavigate?: (href: string) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Filter available talent"
      className="flex max-w-full items-center gap-[var(--cb-space-4)] overflow-x-auto rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-4)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {hireTalentFilters.map((filter) => {
        const active = filter.value === activeFilter;

        return (
          <Link
            key={filter.value}
            href={filterHref(filter.value, activeTech)}
            scroll={false}
            prefetch={false}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              if (!onNavigate) return;

              event.preventDefault();
              onNavigate(filterHref(filter.value, activeTech));
            }}
            aria-current={active ? "page" : undefined}
            className={
              "inline-flex h-[var(--cb-size-32)] shrink-0 items-center gap-[var(--cb-space-4)] rounded-[var(--cb-radius-full)] px-[var(--cb-space-12)] text-xs font-medium leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] " +
              (active
                ? "bg-[color:var(--cb-primary)] text-[color:var(--cb-text)]"
                : "text-[color:var(--cb-text-muted)] hover:bg-[color:var(--cb-panel)] hover:text-[color:var(--cb-text-secondary)]")
            }
          >
            {filter.label}
            {filter.count ? (
              <span
                className={
                  "text-[10px] " +
                  (active
                    ? "text-[color:var(--cb-text-secondary)]"
                    : "text-[color:var(--cb-text-muted)]")
                }
              >
                {filter.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
