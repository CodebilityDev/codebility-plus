import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import type { EyebrowVariant } from "@/components/global/design-system/Eyebrow";

export type SectionHeaderAlign = "left" | "center";

const headingClasses =
  "text-[32px] font-bold leading-9 tracking-tight text-[#f4f4f4] md:text-[44px] md:leading-[48px]";

const accentClasses =
  "block bg-gradient-to-b from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent";

export interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowVariant?: EyebrowVariant;
  title: ReactNode;
  accent?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  align?: SectionHeaderAlign;
  className?: string;
}

function SectionHeader({
  eyebrow,
  eyebrowVariant,
  title,
  accent,
  description,
  actions,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <Eyebrow variant={eyebrowVariant}>{eyebrow}</Eyebrow>
      ) : null}
      <h2 className={headingClasses}>
        {title}
        {accent ? <span className={accentClasses}>{accent}</span> : null}
      </h2>
      {description ? (
        <p className="max-w-[54ch] text-lg leading-7 text-white/60">
          {description}
        </p>
      ) : null}
      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

export { SectionHeader };
