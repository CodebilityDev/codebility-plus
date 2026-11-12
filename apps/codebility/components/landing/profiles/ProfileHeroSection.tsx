import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Clock,
} from "lucide-react";

import { Button } from "@/components/global/design-system/Button";
import { getSkillCategories } from "@/lib/global/skill-categories-cached";
import { getCachedProfileDetail } from "@/lib/global/profile-detail-cached";
import {
  formatScheduleDays,
  formatScheduleTimeRange,
  getCurrentExperience,
  getInitials,
} from "@/utils/landing/profiles/profile-display";
import { asLevelRecord } from "@/utils/global/codev-level";

const LEVEL_ORDER = ["Mobile", "Backend", "Frontend", "UI/UX", "QA"];

export async function ProfileHeroSection({ id }: { id: string }) {
  const [codev, skillCategories] = await Promise.all([
    getCachedProfileDetail(id),
    getSkillCategories(),
  ]);

  if (!codev) return null;

  const currentExperience = getCurrentExperience(codev.work_experience);
  const schedule = codev.work_schedules?.[0] ?? null;
  const level = Object.fromEntries(
    Object.entries(asLevelRecord(codev.level)).filter(
      ([, categoryLevel]) => Number(categoryLevel) > 0,
    ),
  );
  const name = codev.first_name + " " + codev.last_name;

  const levelChips = Object.entries(level)
    .map(([categoryId, categoryLevel]) => {
      const category = skillCategories.find((item) => item.id === categoryId);
      if (!category) return null;

      const levelNumber = Number(categoryLevel);
      const categoryName = category.name
        .replace(/\s+(Developer|Designer|Engineer)$/i, "")
        .trim();
      const prefix =
        category.badge_prefix ?? category.name.substring(0, 2).toLowerCase();
      const badge =
        levelNumber >= 6
          ? prefix + "-tier-champion.svg"
          : prefix + "-tier-" + levelNumber + ".svg";

      return {
        categoryName,
        level: levelNumber,
        badgeSrc: "/assets/svgs/badges/" + badge,
      };
    })
    .filter(
      (
        item,
      ): item is {
        categoryName: string;
        level: number;
        badgeSrc: string;
      } => item !== null,
    )
    .sort((a, b) => {
      const aIndex = LEVEL_ORDER.indexOf(a.categoryName);
      const bIndex = LEVEL_ORDER.indexOf(b.categoryName);
      return (aIndex === -1 ? LEVEL_ORDER.length : aIndex) -
        (bIndex === -1 ? LEVEL_ORDER.length : bIndex);
    });

  const jobLine =
    currentExperience &&
    currentExperience.position + " at " + currentExperience.company_name;

  const scheduleLine =
    schedule &&
    formatScheduleDays(schedule.days_of_week) +
      ", " +
      formatScheduleTimeRange(schedule).replace(/:00/g, "");

  return (
    <article className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] lg:min-h-[456px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_8%,color-mix(in_srgb,var(--cb-primary)_20%,transparent)_0%,transparent_55%)]"
      />
      <div className="relative grid gap-[var(--cb-space-32)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)] lg:grid-cols-[342px_minmax(0,1fr)] lg:gap-[44px]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface-2)] lg:h-[342px] lg:w-[342px]">
          {codev.image_url ? (
            <Image
              src={codev.image_url}
              alt={name}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 342px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-5xl font-semibold text-[color:var(--cb-text-muted)]">
              {getInitials(codev.first_name, codev.last_name)}
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col">
          <div>
            <span className="inline-flex h-[var(--cb-size-28)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-success)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-success)_10%,transparent)] px-[var(--cb-space-12)] text-[11px] font-medium leading-4 text-[color:var(--cb-text-secondary)]">
              <span
                aria-hidden
                className="h-[var(--cb-size-6)] w-[var(--cb-size-6)] rounded-[var(--cb-radius-full)] bg-[color:var(--cb-success)]"
              />
              {codev.availability_status
                ? "Available for projects"
                : "Currently unavailable"}
            </span>

            <h1 className="mt-[var(--cb-space-16)] flex flex-wrap items-center gap-[var(--cb-space-8)] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[52px] lg:text-[56px]">
              {name}
              <BadgeCheck
                aria-label="Verified developer"
                className="h-[var(--cb-size-24)] w-[var(--cb-size-24)] shrink-0 text-[color:var(--cb-text-secondary)]"
              />
            </h1>

            {codev.display_position ? (
              <p className="mt-[var(--cb-space-8)] text-xl leading-8 text-[color:var(--cb-text-secondary)] sm:text-2xl">
                {codev.display_position}
              </p>
            ) : null}

            {codev.about ? (
              <p className="mt-[var(--cb-space-20)] max-w-[660px] text-base leading-7 text-[color:var(--cb-text-muted)]">
                {codev.about}
              </p>
            ) : null}
          </div>

          {jobLine || scheduleLine ? (
            <div className="mt-[var(--cb-space-20)] flex flex-col gap-[var(--cb-space-12)] text-sm leading-5 text-[color:var(--cb-text-secondary)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-[var(--cb-space-12)]">
              {jobLine ? (
                <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                  <Briefcase
                    aria-hidden
                    className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] text-[color:var(--cb-text-muted)]"
                  />
                  {jobLine}
                </span>
              ) : null}
              {scheduleLine ? (
                <span className="inline-flex items-center gap-[var(--cb-space-8)]">
                  <Clock
                    aria-hidden
                    className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] text-[color:var(--cb-text-muted)]"
                  />
                  {scheduleLine}
                </span>
              ) : null}
            </div>
          ) : null}

          {levelChips.length > 0 ? (
            <div className="mt-[var(--cb-space-24)] flex flex-wrap gap-[var(--cb-space-8)]">
              {levelChips.map((chip) => (
                <span
                  key={chip.categoryName}
                  className="flex h-[44px] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-8)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] px-[10px]"
                >
                  <Image
                    src={chip.badgeSrc}
                    alt=""
                    width={24}
                    height={24}
                    loading="lazy"
                    className="h-[var(--cb-size-24)] w-[var(--cb-size-24)] object-contain"
                  />
                  <span className="flex flex-col">
                    <span className="text-xs font-medium leading-4 text-[color:var(--cb-text)]">
                      {chip.categoryName}
                    </span>
                    <span className="text-[10px] leading-3 text-[color:var(--cb-text-muted)]">
                      Level {chip.level}
                    </span>
                  </span>
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-[var(--cb-space-24)] flex flex-wrap items-center gap-[var(--cb-space-12)]">
            <Button asChild>
              <Link href="/hire-a-codev">
                Hire {codev.first_name}
                <ArrowRight
                  aria-hidden
                  className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/codevs">Back to CoDevs</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
