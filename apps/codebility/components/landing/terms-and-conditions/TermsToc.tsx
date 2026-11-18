"use client";

import { cn } from "@codevs/ui";

import { useActiveSection } from "@/hooks/global/useActiveSection";
import { TERMS_SECTIONS } from "@/constants/global/terms-and-conditions";

const sectionIds = TERMS_SECTIONS.map((section) => section.id);

export function TermsToc() {
  const active = useActiveSection(sectionIds, sectionIds[0] ?? "");

  return (
    <nav aria-label="On this page">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cb-text-decorative)]">
        On this page
      </p>
      <ol className="mt-[var(--cb-space-16)] flex flex-col gap-[var(--cb-space-2)]">
        {TERMS_SECTIONS.map((section, index) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex items-center gap-[var(--cb-space-12)] rounded-[var(--cb-radius-8)] px-[var(--cb-space-12)] py-[var(--cb-space-8)] text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]",
                  isActive
                    ? "bg-[color:var(--cb-selected-fill)] text-[color:var(--cb-text)]"
                    : "text-[color:var(--cb-text-muted)] hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text)]",
                )}
              >
                <span
                  className={cn(
                    "w-5 text-xs tabular-nums",
                    isActive
                      ? "text-[color:var(--cb-accent-text)]"
                      : "text-[color:var(--cb-text-decorative)]",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
