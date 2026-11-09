"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import { Chip } from "@/components/global/design-system/Chip";
import { ProfileCard } from "@/components/global/design-system/ProfileCard";
import { RoleBadge } from "@/components/global/design-system/RoleBadge";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { people } from "@/constants/landing/landing-content";
import type { LandingPerson } from "@/constants/landing/landing-content";

const peopleFilters = [
  { value: "all", label: "All", count: "164" },
  { value: "admin", label: "Admins", count: "8" },
  { value: "mentor", label: "Mentors", count: "8" },
  { value: "codev", label: "CoDevs", count: "100+" },
] as const;

type PeopleFilter = (typeof peopleFilters)[number]["value"];

function matchesFilter(person: LandingPerson, filter: PeopleFilter) {
  return filter === "all" || person.badgeRole === filter;
}

export function LandingPeople() {
  const [filter, setFilter] = useState<PeopleFilter>("all");
  const visiblePeople = people.filter((person) => matchesFilter(person, filter));

  return (
    <section id="people" className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-32">
      <LandingContainer className="flex flex-col gap-[var(--cb-space-32)] lg:gap-[var(--cb-space-40)]">
        <SectionHeader
          align="center"
          title="Meet the people behind Codebility"
          description="Admins, mentors and CoDevs who turn ideas into shipped products."
        />

        <div className="flex justify-center">
          <div
            role="group"
            aria-label="Filter people by role"
            className="flex flex-wrap items-center justify-center gap-[var(--cb-space-4)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-4)]"
          >
            {peopleFilters.map((item) => {
              const selected = filter === item.value;

              return (
                <Chip
                  key={item.value}
                  selected={selected}
                  onClick={() => setFilter(item.value)}
                  aria-controls="people-grid"
                  className="whitespace-nowrap"
                >
                  {item.label}
                  <span
                    className={cn(
                      "text-xs leading-4",
                      selected ? "text-[color:var(--cb-text-secondary)]" : "text-[color:var(--cb-text-muted)]",
                    )}
                  >
                    {item.count}
                  </span>
                </Chip>
              );
            })}
          </div>
        </div>

        <ul
          id="people-grid"
          aria-label="People at Codebility"
          className="grid grid-cols-1 gap-[var(--cb-space-16)] sm:grid-cols-2 xl:grid-cols-4"
        >
          {visiblePeople.map((person) => (
            <li key={person.name} className="min-w-0">
              <ProfileCard
                variant="tall"
                name={person.name}
                role={person.role}
                initials={person.initials}
                imageSrc={person.imageSrc}
                badge={
                  person.badgeRole ? (
                    <RoleBadge
                      role={person.badgeRole}
                      label={person.badgeLabel}
                    />
                  ) : null
                }
                profileHref="/codevs"
              />
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
          <Button asChild variant="outline">
            <Link href="/codevs">View all CoDevs</Link>
          </Button>
          <Button asChild>
            <Link href="/hire-a-codev">
              Hire CoDevs
              <ArrowRight aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          </Button>
        </div>
      </LandingContainer>
    </section>
  );
}
