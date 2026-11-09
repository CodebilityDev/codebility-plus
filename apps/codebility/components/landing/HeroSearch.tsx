"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

import { cn } from "@codevs/ui";

import { Chip } from "@/components/global/design-system/Chip";
import { useLandingSearchTransition } from "@/components/landing/LandingSearchTransition";
import { Search } from "@/components/global/design-system/Search";
import { heroTags } from "@/constants/landing/landing-content";

function HeroSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isPending, navigate } = useLandingSearchTransition();
  const urlQuery = (searchParams.get("search") ?? "").trim();
  const [draft, setDraft] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (draft !== null && draft.trim() === urlQuery) {
    setDraft(null);
  }

  const value = draft ?? urlQuery;

  function commit(next: string, replace = true) {
    if (window.location.pathname !== pathname) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const query = next.trim();
    const params = new URLSearchParams(window.location.search);

    if (query) params.set("search", query);
    else params.delete("search");
    params.delete("page");

    const href = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    navigate(href, { replace });
  }

  function handleChange(next: string) {
    setDraft(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commit(next), 300);
  }

  function selectTag(tag: string) {
    setDraft(tag);
    commit(tag, false);
  }

  return (
    <div
      aria-busy={isPending}
      className="mx-auto flex w-full max-w-[640px] flex-col items-center gap-[var(--cb-space-24)]"
    >
      <Search
        value={value}
        onValueChange={handleChange}
        onSearch={() => commit(value, false)}
        placeholder="Search by skill: React, Flutter, UI/UX..."
        buttonLabel="Find developers"
        inputAriaLabel="Search developers by skill"
        iconOnlyOnMobile
        className="w-full"
      />
      <div className="flex flex-wrap items-center justify-center gap-[var(--cb-space-8)]">
        {heroTags.map((tag) => {
          const selected = urlQuery.toLowerCase() === tag.toLowerCase();

          return (
            <Chip
              key={tag}
              selected={selected}
              className={cn(
                "h-[var(--cb-size-32)] px-[var(--cb-space-16)] text-xs",
                !selected &&
                  "bg-[color:color-mix(in_srgb,var(--cb-bg)_25%,transparent)]",
              )}
              onClick={() => selectTag(tag)}
            >
              {tag}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}

export { HeroSearch };
