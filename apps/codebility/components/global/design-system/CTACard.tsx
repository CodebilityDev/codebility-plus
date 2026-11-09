import Link from "next/link";

import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";

export interface CTACardProps {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  className?: string;
}

function CTACard({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: CTACardProps) {
  return (
    <div
      className={cn(
        "relative flex h-[260px] flex-col items-center justify-center gap-[var(--cb-space-12)] overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-pill-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-32)] text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-10 top-0 h-[var(--cb-size-96)] rounded-[var(--cb-radius-full)] bg-[color:color-mix(in_srgb,var(--cb-primary)_25%,transparent)] blur-3xl"
      />
      <div className="relative z-10 flex flex-col items-center gap-[var(--cb-space-12)]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="text-2xl font-semibold leading-[30px] text-[color:var(--cb-text)]">
          {title}
        </h3>
        <p className="text-sm text-[color:var(--cb-text-muted)]">{description}</p>
        <Button asChild size="sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
    </div>
  );
}

export { CTACard };
