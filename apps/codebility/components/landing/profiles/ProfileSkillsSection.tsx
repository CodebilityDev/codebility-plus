import Image from "next/image";

import { ProfileSectionCard } from "@/components/landing/profiles/ProfileSectionCard";
import { getCachedProfileDetail } from "@/lib/global/profile-detail-cached";
import { groupProfileTechStacks } from "@/utils/landing/profiles/profile-display";

export async function ProfileSkillsSection({ id }: { id: string }) {
  const codev = await getCachedProfileDetail(id);

  if (!codev) return null;

  const stacks = codev.tech_stacks ?? [];
  if (stacks.length === 0) return null;

  const groups = groupProfileTechStacks(stacks);

  return (
    <ProfileSectionCard>
      <div className="flex items-end justify-between gap-[var(--cb-space-16)]">
        <h2 className="text-xl font-semibold leading-7 text-[color:var(--cb-text)]">
          Skills
        </h2>
        <span className="text-[13px] leading-[18px] text-[color:var(--cb-text-muted)]">
          {stacks.length} technologies
        </span>
      </div>

      <div className="mt-[var(--cb-space-24)] flex flex-col gap-[var(--cb-space-20)]">
        {groups.map((group) => (
          <div key={group.name}>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--cb-text-muted)]">
              {group.name}
            </p>
            <div className="mt-[10px] flex flex-wrap gap-[var(--cb-space-8)]">
              {group.technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex h-[var(--cb-size-32)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-8)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] px-[10px] text-xs leading-4 text-[color:var(--cb-text-secondary)]"
                >
                  <Image
                    src={tech.iconSrc}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 object-contain"
                  />
                  {tech.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ProfileSectionCard>
  );
}
