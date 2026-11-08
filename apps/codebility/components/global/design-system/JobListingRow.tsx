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
        "group flex min-h-[92px] flex-col gap-4 border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303] md:flex-row md:items-center",
        active
          ? "border-[#9747ff]/40 bg-[#9747ff]/[0.10]"
          : "border-white/10 bg-white/[0.02] hover:border-[#9747ff]/40 hover:bg-[#9747ff]/[0.10]",
        className,
      )}
    >
      <IconTile
        variant="glass"
        className="h-10 w-10 shrink-0 [&>svg]:h-4 [&>svg]:w-4"
      >
        {icon}
      </IconTile>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-[15px] font-semibold leading-[21px] text-[#f4f4f4]">
          {title}
        </h3>
        <p className="text-[13px] leading-[19px] text-white/50">
          {description}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:ml-auto">
        {tags.map((tag, index) => (
          <span
            key={`${tag.label}-${index}`}
            className={cn(
              "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium leading-4",
              tag.highlighted
                ? "border-purple-400 bg-[#9747ff] text-purple-100"
                : "border-white/10 bg-white/[0.04] text-white/60",
            )}
          >
            {tag.icon ? (
              <span className="flex items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5">
                {tag.icon}
              </span>
            ) : null}
            {tag.label}
          </span>
        ))}
        <span className="text-xs leading-[18px] text-white/50">
          Posted {postedAt}
        </span>
      </div>
      <span
        aria-hidden
        className={cn(
          "ml-1 flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-full border transition-colors md:self-auto",
          active
            ? "border-[#9747ff] bg-[#9747ff] text-white"
            : "border-white/20 bg-white/[0.04] text-white/70 group-hover:border-[#9747ff] group-hover:bg-[#9747ff] group-hover:text-white",
        )}
      >
        <ArrowRight className="h-[18px] w-[18px]" />
      </span>
    </Link>
  );
}

export { JobListingRow };
