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
    <section id="people" className="border-t border-white/10 py-24 lg:py-32">
      <LandingContainer className="flex flex-col gap-8 lg:gap-10">
        <SectionHeader
          align="center"
          title="Meet the people behind Codebility"
          description="Admins, mentors and CoDevs who turn ideas into shipped products."
        />

        <div className="flex justify-center">
          <div
            role="group"
            aria-label="Filter people by role"
            className="flex flex-wrap items-center justify-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1"
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
                      selected ? "text-white/70" : "text-white/50",
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
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

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/codevs">View all CoDevs</Link>
          </Button>
          <Button asChild>
            <Link href="/hire-a-codev">
              Hire CoDevs
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </LandingContainer>
    </section>
  );
}
