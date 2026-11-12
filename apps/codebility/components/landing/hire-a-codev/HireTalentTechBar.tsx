"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

import { hireTalentTech } from "@/constants/landing/hire-a-codev/content";
import type {
  HireTalentFilterValue,
  HireTalentTech,
} from "@/constants/landing/hire-a-codev/content";

function techHref(
  filter: HireTalentFilterValue,
  tech?: HireTalentTech,
) {
  const params = new URLSearchParams();

  if (filter !== "all") params.set("filter", filter);
  if (tech) params.set("tech", tech);

  const query = params.toString();
  return `/hire-a-codev${query ? `?${query}` : ""}#talent`;
}

export function HireTalentTechBar({
  activeFilter,
  activeTech,
  onNavigate,
}: {
  activeFilter: HireTalentFilterValue;
  activeTech?: HireTalentTech;
  onNavigate?: (href: string) => void;
}) {
  return (
    <div className="mt-[var(--cb-space-24)] flex flex-wrap items-center justify-center gap-[var(--cb-space-8)]">
      {hireTalentTech.map((tech) => {
        const active = tech === activeTech;

        return (
          <Link
            key={tech}
            href={techHref(activeFilter, active ? undefined : tech)}
            scroll={false}
            prefetch={false}
            aria-current={active ? "true" : undefined}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
              if (!onNavigate) return;

              event.preventDefault();
              onNavigate(techHref(activeFilter, active ? undefined : tech));
            }}
            className={
              "inline-flex h-[var(--cb-size-32)] items-center rounded-[var(--cb-radius-full)] border px-[var(--cb-space-12)] text-xs leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] " +
              (active
                ? "border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_15%,transparent)] text-[color:var(--cb-p200)]"
                : "border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] text-[color:var(--cb-text-secondary)] hover:border-[color:color-mix(in_srgb,var(--cb-primary)_35%,transparent)] hover:text-[color:var(--cb-text)]")
            }
          >
            {tech}
          </Link>
        );
      })}
    </div>
  );
}
