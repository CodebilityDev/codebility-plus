import { ProfileSectionCard } from "@/components/landing/profiles/ProfileSectionCard";
import { getCachedProfileDetail } from "@/lib/global/profile-detail-cached";
import { getProfileReferenceDate } from "@/lib/landing/profiles/profile-reference";
import {
  formatExperienceDuration,
  formatExperiencePeriod,
} from "@/utils/landing/profiles/profile-display";

export async function ProfileExperienceSection({ id }: { id: string }) {
  const [codev, referenceDate] = await Promise.all([
    getCachedProfileDetail(id),
    getProfileReferenceDate(),
  ]);
  const experiences = codev?.work_experience ?? [];

  if (!codev || experiences.length === 0) return null;

  const sorted = [...experiences].sort((a, b) => {
    if (a.is_present !== b.is_present) return a.is_present ? -1 : 1;
    return new Date(b.date_from).getTime() - new Date(a.date_from).getTime();
  });
  const since = sorted.reduce((earliest, experience) => {
    const year = new Date(experience.date_from).getUTCFullYear();
    return year < earliest ? year : earliest;
  }, Number.POSITIVE_INFINITY);

  return (
    <ProfileSectionCard>
      <div className="flex items-end justify-between gap-[var(--cb-space-16)]">
        <h2 className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
          Experience
        </h2>
        <span className="text-[13px] leading-[18px] text-[color:var(--cb-text-muted)]">
          Since {since}
        </span>
      </div>

      <div className="relative mt-[var(--cb-space-20)]">
        <ol className="flex flex-col gap-[var(--cb-space-24)]">
          {sorted.map((experience, index) => (
            <li
              key={experience.id}
              className="relative pl-[48px]"
            >
              {index < sorted.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute bottom-[-18px] left-[13px] top-[26px] w-[2px] bg-[color:color-mix(in_srgb,var(--cb-white)_14%,transparent)]"
                />
              ) : null}
              <span
                aria-hidden
                className={
                  "absolute left-[6px] top-[4px] h-[16px] w-[16px] rounded-[var(--cb-radius-full)] " +
                  (index === 0
                    ? "bg-[color:var(--cb-primary)]"
                    : "border-2 border-[color:color-mix(in_srgb,var(--cb-white)_22%,transparent)] bg-[color:var(--cb-surface)]")
                }
              />
              <div className="grid gap-[var(--cb-space-4)] sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-[var(--cb-space-16)]">
                <div className="min-w-0">
                  <p className="text-base font-semibold leading-6 text-[color:var(--cb-text)]">
                    {experience.position}
                  </p>
                  <p className="mt-[2px] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                    {experience.company_name}
                    {experience.location ? " · " + experience.location : ""}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs leading-[18px] text-[color:var(--cb-text-secondary)]">
                    {formatExperiencePeriod(experience)}
                  </p>
                  <p className="text-[11px] leading-4 text-[color:var(--cb-text-muted)]">
                    {formatExperienceDuration(experience, referenceDate)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </ProfileSectionCard>
  );
}
