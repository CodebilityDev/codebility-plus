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
        "relative flex h-[260px] flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-purple-300/30 bg-white/[0.03] p-8 text-center",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-10 top-0 h-24 rounded-full bg-[#9747ff]/25 blur-3xl"
      />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 className="text-2xl font-semibold leading-[30px] text-[#f4f4f4]">
          {title}
        </h3>
        <p className="text-sm text-white/60">{description}</p>
        <Button asChild size="sm">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </div>
    </div>
  );
}

export { CTACard };
