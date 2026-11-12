import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { TechTag } from "@/components/global/design-system/TechTag";
import type { TechTagTone } from "@/components/global/design-system/TechTag";

export interface SkillCategoryCardProps {
  icon: ReactNode;
  title: string;
  skills: string[];
  tone?: TechTagTone;
  className?: string;
}

function SkillCategoryCard({
  icon,
  title,
  skills,
  tone,
  className,
}: SkillCategoryCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[116px] w-full flex-col gap-2.5 rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)]",
        className,
      )}
    >
      <div className="flex items-center gap-[var(--cb-space-8)]">
        <span
          aria-hidden
          className="flex h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 items-center justify-center text-[color:var(--cb-text-muted)] [&>svg]:h-[var(--cb-size-16)] [&>svg]:w-[var(--cb-size-16)]"
        >
          {icon}
        </span>
        <h3 className="text-[15px] font-semibold leading-[21px] text-[color:var(--cb-text)]">
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-[var(--cb-space-6)]">
        {skills.map((skill) => (
          <TechTag key={skill} tone={tone}>{skill}</TechTag>
        ))}
      </div>
    </div>
  );
}

export { SkillCategoryCard };
