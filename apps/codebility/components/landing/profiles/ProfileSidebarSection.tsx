import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";

import { Button } from "@/components/global/design-system/Button";
import { IconTile } from "@/components/global/design-system/IconTile";
import { ProfileSectionCard } from "@/components/landing/profiles/ProfileSectionCard";
import { getCachedProfileDetail } from "@/lib/global/profile-detail-cached";
import {
  formatDegreeLabel,
  formatEducationYears,
  formatScheduleTimeRange,
} from "@/utils/landing/profiles/profile-display";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export async function ProfileSidebarSection({ id }: { id: string }) {
  const codev = await getCachedProfileDetail(id);

  if (!codev) return null;

  const schedule = codev.work_schedules?.[0] ?? null;
  const education = codev.education ?? [];
  const firstName = codev.first_name;

  return (
    <div className="flex flex-col gap-[var(--cb-space-24)]">
      {schedule ? (
        <ProfileSectionCard>
          <h2 className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
            Work schedule
          </h2>
          <div className="mt-[var(--cb-space-16)] flex items-center gap-[var(--cb-space-8)] text-[15px] font-medium leading-6 text-[color:var(--cb-text)]">
            <Clock
              aria-hidden
              className="h-[var(--cb-size-18)] w-[var(--cb-size-18)] text-[color:var(--cb-text-secondary)]"
            />
            {formatScheduleTimeRange(schedule)}
          </div>
          <p className="mt-[var(--cb-space-4)] text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
            Philippine Time (GMT +8)
          </p>

          <div className="mt-[var(--cb-space-20)] grid grid-cols-7 gap-[var(--cb-space-4)]">
            {DAY_NAMES.map((day, index) => {
              const active = schedule.days_of_week.includes(day);

              return (
                <span
                  key={day}
                  className={
                    "flex h-[36px] items-center justify-center rounded-[var(--cb-radius-8)] border text-[11px] font-medium leading-4 " +
                    (active
                      ? "border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_16%,transparent)] text-[color:var(--cb-text)]"
                      : "border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] text-[color:var(--cb-text-muted)]")
                  }
                >
                  {DAY_LABELS[index]}
                </span>
              );
            })}
          </div>
        </ProfileSectionCard>
      ) : null}

      {education.length > 0 ? (
        <ProfileSectionCard>
          <h2 className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
            Education
          </h2>
          <div className="mt-[var(--cb-space-16)] flex flex-col gap-[var(--cb-space-16)]">
            {education.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-[var(--cb-space-12)]"
              >
                <IconTile
                  variant="glass"
                  className="h-[var(--cb-size-40)] w-[var(--cb-size-40)] shrink-0 rounded-[var(--cb-radius-8)] border-[color:color-mix(in_srgb,var(--cb-primary)_30%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_14%,transparent)] text-[color:var(--cb-p400)]"
                >
                  <GraduationCap
                    aria-hidden
                    className="h-[var(--cb-size-18)] w-[var(--cb-size-18)]"
                  />
                </IconTile>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
                    {item.institution}
                  </p>
                  <p className="mt-[2px] text-[13px] leading-[18px] text-[color:var(--cb-text-muted)]">
                    {formatDegreeLabel(item.degree)}
                  </p>
                  <p className="mt-[2px] text-[11px] leading-4 text-[color:var(--cb-text-muted)]">
                    {formatEducationYears(item.start_date, item.end_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ProfileSectionCard>
      ) : null}

      <section className="relative overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_srgb,var(--cb-primary)_24%,transparent)_0%,transparent_65%)]"
        />
        <div className="relative">
          <h2 className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
            Want {firstName} on your team?
          </h2>
          <p className="mt-[var(--cb-space-8)] text-[13px] leading-[19px] text-[color:var(--cb-text-muted)]">
            Book a free 30-minute call. We&apos;ll confirm availability and set
            up an interview.
          </p>
          <Button asChild className="mt-[var(--cb-space-20)] w-full">
            <Link href="/bookacall">
              Book a Call
              <ArrowRight
                aria-hidden
                className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
              />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
