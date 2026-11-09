import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import type { EyebrowVariant } from "@/components/global/design-system/Eyebrow";

export type SectionHeaderAlign = "left" | "center";

const headingClasses =
  "text-[32px] font-bold leading-9 tracking-tight text-[color:var(--cb-text)] md:text-[44px] md:leading-[48px]";

const accentClasses = "cb-accent-text block";

export interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowVariant?: EyebrowVariant;
  eyebrowClassName?: string;
  title: ReactNode;
  accent?: ReactNode;
  accentClassName?: string;
  description?: ReactNode;
  actions?: ReactNode;
  align?: SectionHeaderAlign;
  className?: string;
}

function SectionHeader({
  eyebrow,
  eyebrowVariant,
  eyebrowClassName,
  title,
  accent,
  accentClassName,
  description,
  actions,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--cb-space-12)]",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow variant={eyebrowVariant} className={eyebrowClassName}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <h2 className={headingClasses}>
        {title}
        {accent ? (
          <span className={cn(accentClasses, accentClassName)}>{accent}</span>
        ) : null}
      </h2>
      {description ? (
        <p className="max-w-[54ch] text-lg leading-7 text-[color:var(--cb-text-muted)]">
          {description}
        </p>
      ) : null}
      {actions ? (
        <div className="flex flex-wrap items-center gap-[var(--cb-space-12)]">{actions}</div>
      ) : null}
    </div>
  );
}

export { SectionHeader };
