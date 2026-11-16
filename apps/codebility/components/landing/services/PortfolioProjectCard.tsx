import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { PortfolioProject } from "@/types/landing/services/portfolio";

const badgeTone: Record<string, string> = {
  CMS: "border-[color:rgba(45,212,191,0.3)] bg-[color:rgba(45,212,191,0.12)] text-[#5EEAD4]",
  "Web App":
    "border-[color:rgba(59,130,246,0.3)] bg-[color:rgba(59,130,246,0.14)] text-[#93C5FD]",
  "Mobile App":
    "border-[color:rgba(168,85,247,0.3)] bg-[color:rgba(168,85,247,0.14)] text-[#C4B5FD]",
  "Product Design":
    "border-[color:rgba(244,114,182,0.3)] bg-[color:rgba(244,114,182,0.14)] text-[#F9A8D4]",
  "AI Development":
    "border-[color:rgba(34,211,238,0.3)] bg-[color:rgba(34,211,238,0.12)] text-[#67E8F9]",
};

function toneFor(badge: string) {
  return badgeTone[badge] ?? "border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] text-[color:var(--cb-text-secondary)]";
}
export function PortfolioProjectCard({
  project,
  href,
}: {
  project: PortfolioProject;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[#0B0B0D] transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cb-border)] bg-[#151515]">
        {project.imageSrc ? (
          <Image
            src={project.imageSrc}
            alt={project.name}
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 100vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--cb-surface-2)] to-[var(--cb-surface)] px-6 text-center text-xl font-semibold text-[color:var(--cb-text-muted)]">
            {project.name}
          </div>
        )}
        <span className="absolute right-[var(--cb-space-12)] top-[var(--cb-space-12)] inline-flex h-[var(--cb-size-24)] items-center gap-[var(--cb-space-6)] rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-white)_12%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-bg)_75%,transparent)] px-[10px] text-[11px] font-medium leading-4 text-[color:var(--cb-text-secondary)] backdrop-blur">
          <span
            aria-hidden
            className="h-[var(--cb-size-6)] w-[var(--cb-size-6)] rounded-[var(--cb-radius-full)] bg-[color:var(--cb-primary)]"
          />
          {project.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[var(--cb-space-8)] p-[var(--cb-space-20)]">
        <h3 className="text-lg font-semibold leading-6 text-[color:var(--cb-text)]">
          {project.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-[21px] text-[color:var(--cb-text-muted)]">
          {project.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-[var(--cb-space-12)] pt-[var(--cb-space-12)]">
          <span
            className={
              "inline-flex h-[var(--cb-size-24)] items-center rounded-[6px] border px-[10px] text-[11px] font-medium leading-4 " +
              toneFor(project.badge)
            }
          >
            {project.badge}
          </span>
          <span className="inline-flex items-center gap-[var(--cb-space-6)] text-sm leading-5 text-[color:var(--cb-p400)]">
            View project
            <ArrowRight
              aria-hidden
              className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
