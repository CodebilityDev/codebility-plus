import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { IconTile } from "@/components/global/design-system/IconTile";

export interface JobListingTag {
  label: string;
  highlighted?: boolean;
  icon?: ReactNode;
}

export interface JobListingRowProps {
  title: string;
  description: string;
  icon: ReactNode;
  tags: JobListingTag[];
  postedAt: string;
  href: string;
  active?: boolean;
  className?: string;
}

function JobListingRow({
  title,
  description,
  icon,
  tags,
  postedAt,
  href,
  active = false,
  className,
}: JobListingRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex min-h-[92px] flex-col gap-[var(--cb-space-16)] border p-[var(--cb-space-16)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] md:flex-row md:items-center",
        active
          ? "border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_10%,transparent)]"
          : "border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] hover:border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] hover:bg-[color:color-mix(in_srgb,var(--cb-primary)_10%,transparent)]",
        className,
      )}
    >
      <IconTile
        variant="glass"
        className="h-[var(--cb-size-40)] w-[var(--cb-size-40)] shrink-0 [&>svg]:h-[var(--cb-size-16)] [&>svg]:w-[var(--cb-size-16)]"
      >
        {icon}
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-[var(--cb-space-4)]">
        <h3 className="text-[15px] font-semibold leading-[21px] text-[color:var(--cb-text)]">
          {title}
        </h3>
        <p className="text-[13px] leading-[19px] text-[color:var(--cb-text-muted)]">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-[var(--cb-space-8)] md:ml-auto">
        {tags.map((tag, index) => (
          <span
            key={`${tag.label}-${index}`}
            className={cn(
              "inline-flex h-[var(--cb-size-24)] items-center gap-[var(--cb-space-6)] rounded-[var(--cb-radius-full)] border px-2.5 text-[11px] font-medium leading-4",
              tag.highlighted
                ? "border-[color:var(--cb-p400)] bg-[color:var(--cb-primary)] text-[color:var(--cb-p100)]"
                : "border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] text-[color:var(--cb-text-muted)]",
            )}
          >
            {tag.icon ? (
              <span className="flex items-center justify-center [&>svg]:h-[var(--cb-size-14)] [&>svg]:w-[var(--cb-size-14)]">
                {tag.icon}
              </span>
            ) : null}
            {tag.label}
          </span>
        ))}
        <span className="text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
          Posted {postedAt}
        </span>
      </div>
      <span
        aria-hidden
        className={cn(
          "ml-[var(--cb-space-4)] flex h-[var(--cb-size-40)] w-[var(--cb-size-40)] shrink-0 items-center justify-center self-end rounded-[var(--cb-radius-full)] border transition-colors md:self-auto",
          active
            ? "border-[color:var(--cb-primary)] bg-[color:var(--cb-primary)] text-[color:var(--cb-text)]"
            : "border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] bg-[color:var(--cb-glass)] text-[color:var(--cb-text-secondary)] group-hover:border-[color:var(--cb-primary)] group-hover:bg-[color:var(--cb-primary)] group-hover:text-[color:var(--cb-text)]",
        )}
      >
        <ArrowRight className="h-[var(--cb-size-18)] w-[var(--cb-size-18)]" />
      </span>
    </Link>
  );
}

export { JobListingRow };
