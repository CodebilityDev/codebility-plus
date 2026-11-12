import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { Eyebrow } from "@/components/global/design-system/Eyebrow";

export function HireSectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  accent?: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--cb-space-12)]",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <Eyebrow variant="outline" className="tracking-[0.12em]">
        {eyebrow}
      </Eyebrow>
      <h2 className="max-w-[900px] text-balance text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-[color:var(--cb-text)] md:text-[44px] md:leading-[1.05] lg:text-[48px]">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="cb-community-text">{accent}</span>
          </>
        ) : null}
      </h2>
      {description ? (
        <p className="max-w-[640px] text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
