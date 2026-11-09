import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/global/design-system/Button";
import { ProfileCard } from "@/components/global/design-system/ProfileCard";
import { RoleBadge } from "@/components/global/design-system/RoleBadge";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { LandingPeopleCards } from "@/components/landing/LandingPeopleTransition";
import { LandingPeopleFilters } from "@/components/landing/LandingPeopleFilters";
import { LandingPeopleGridSkeleton } from "@/components/landing/LandingPeopleGridSkeleton";
import { LandingPeoplePagination } from "@/components/landing/LandingPeoplePagination";
import { LandingPeopleTransition } from "@/components/landing/LandingPeopleTransition";
import { getCachedLandingTeamPage } from "@/lib/landing/people";
import type { LandingSearchParams } from "@/types/landing/hero-codevs";
import type { TeamFilter } from "@/types/landing/people";
import { teamFilters } from "@/types/landing/people";

interface LandingPeopleProps {
  searchParams: LandingSearchParams;
}

interface LandingPeopleContentProps {
  searchParams: LandingSearchParams;
}

function parseTeamFilter(
  value: string | string[] | undefined,
): TeamFilter {
  const candidate = Array.isArray(value) ? value[0] : value;

  return teamFilters.includes(candidate as TeamFilter)
    ? (candidate as TeamFilter)
    : "all";
}

function parsePage(value: string | string[] | undefined): number {
  const candidate = Array.isArray(value) ? value[0] : value;
  const parsed = Number(candidate);

  return Number.isInteger(parsed) && parsed >= 1 ? parsed : 1;
}

async function LandingPeopleContent({
  searchParams,
}: LandingPeopleContentProps) {
  const params = await searchParams;
  const filter = parseTeamFilter(params.team);
  const page = parsePage(params.teamPage);
  const data = await getCachedLandingTeamPage(filter, page);

  return (
    <div className="flex flex-col gap-[var(--cb-space-32)]">
      <LandingPeopleFilters active={filter} counts={data.counts} />

      {data.members.length > 0 ? (
        <LandingPeopleCards>
          <ul
            id="people-grid"
            aria-label="People at Codebility"
            className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-[var(--cb-space-24)] sm:grid-cols-2 xl:grid-cols-4"
          >
            {data.members.map((member) => (
              <li key={member.id} className="min-w-0">
                <ProfileCard
                  variant="tall"
                  name={member.name}
                  role={member.role}
                  initials={member.initials}
                  imageSrc={member.imageSrc}
                  badge={
                    <RoleBadge
                      role={member.badgeRole}
                      label={member.badgeLabel}
                    />
                  }
                  profileHref={`/profiles/${member.id}`}
                />
              </li>
            ))}
          </ul>
        </LandingPeopleCards>
      ) : (
        <p className="py-[var(--cb-space-40)] text-center text-sm text-[color:var(--cb-text-muted)]">
          No team members found for this filter.
        </p>
      )}

      {data.totalPages > 1 ? (
        <LandingPeoplePagination
          filter={filter}
          page={data.page}
          totalPages={data.totalPages}
        />
      ) : null}

      <div className="mt-[var(--cb-space-8)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
        <Button asChild variant="outline">
          <Link href="/codevs">View all CoDevs</Link>
        </Button>
        <Button
          asChild
          className="shadow-[0_0_32px_color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
        >
          <Link href="/hire-a-codev">
            Hire CoDevs
            <ArrowRight
              aria-hidden
              className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
            />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function LandingPeople({ searchParams }: LandingPeopleProps) {
  return (
    <section
      id="people"
      className="border-t border-[color:var(--cb-border)] pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[102px] lg:pt-[118px]"
    >
      <LandingContainer className="flex flex-col gap-[var(--cb-space-32)]">
        <SectionHeader
          align="center"
          title="Meet the people behind Codebility"
          description="Admins, mentors and CoDevs who turn ideas into shipped products."
        />

        <LandingPeopleTransition>
          <Suspense fallback={<LandingPeopleGridSkeleton />}>
            <LandingPeopleContent searchParams={searchParams} />
          </Suspense>
        </LandingPeopleTransition>
      </LandingContainer>
    </section>
  );
}

export { LandingPeople };
