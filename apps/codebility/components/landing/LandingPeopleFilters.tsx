"use client";

import { usePathname, useSearchParams } from "next/navigation";

import { Tab, Tabs, TabsList } from "@/components/global/design-system/Tabs";
import { useLandingPeopleTransition } from "@/components/landing/LandingPeopleTransition";
import type { TeamCounts, TeamFilter } from "@/types/global/landing-people";

const filters: { value: TeamFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "admins", label: "Admins" },
  { value: "mentors", label: "Mentors" },
  { value: "codevs", label: "CoDevs" },
];

interface LandingPeopleFiltersProps {
  active: TeamFilter;
  counts: TeamCounts;
}

function LandingPeopleFilters({
  active,
  counts,
}: LandingPeopleFiltersProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isPending, navigate } = useLandingPeopleTransition();

  function handleChange(next: string) {
    if (next === active) return;

    const params = new URLSearchParams(searchParams.toString());

    if (next === "all") params.delete("team");
    else params.set("team", next);
    params.delete("teamPage");

    const href = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;

    navigate(href, { replace: false });
  }

  return (
    <div className="flex justify-center" aria-busy={isPending}>
      <Tabs
        value={active}
        onValueChange={handleChange}
        className="w-full sm:w-auto"
      >
        <TabsList
          aria-label="Filter team by role"
          className="flex h-auto w-full flex-wrap justify-center gap-[var(--cb-space-8)] overflow-visible rounded-none border-0 bg-transparent p-0 sm:w-auto"
        >
          {filters.map((filter) => (
            <Tab
              key={filter.value}
              value={filter.value}
              count={counts[filter.value]}
              className="h-[var(--cb-size-32)] w-auto gap-[var(--cb-space-4)] px-[6px] text-xs hover:bg-transparent focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[color:color-mix(in_srgb,var(--cb-white)_35%,transparent)] focus-visible:ring-offset-0 sm:px-[var(--cb-space-12)]"
            >
              {filter.label}
            </Tab>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export { LandingPeopleFilters };
