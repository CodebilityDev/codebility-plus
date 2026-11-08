import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { TechTag } from "@/components/global/design-system/TechTag";

export interface SkillCategoryCardProps {
  icon: ReactNode;
  title: string;
  skills: string[];
  className?: string;
}

function SkillCategoryCard({
  icon,
  title,
  skills,
  className,
}: SkillCategoryCardProps) {
  return (
    <div
      className={cn(
        "flex min-h-[116px] w-full flex-col gap-2.5 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex h-4 w-4 shrink-0 items-center justify-center text-white/60 [&>svg]:h-4 [&>svg]:w-4"
        >
          {icon}
        </span>
        <h3 className="text-[15px] font-semibold leading-[21px] text-[#f4f4f4]">
          {title}
        </h3>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <TechTag key={skill}>{skill}</TechTag>
        ))}
      </div>
    </div>
  );
}

export { SkillCategoryCard };
