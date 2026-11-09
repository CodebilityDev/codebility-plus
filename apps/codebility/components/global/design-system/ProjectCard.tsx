import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@codevs/ui";

export type ProjectCardVariant = "default" | "minimal";

export interface ProjectCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  tag?: string;
  status?: string;
  href: string;
  variant?: ProjectCardVariant;
  priority?: boolean;
  className?: string;
}

function ProjectCard({
  title,
  description,
  imageSrc,
  imageAlt,
  tag,
  status,
  href,
  variant = "default",
  priority,
  className,
}: ProjectCardProps) {
  const minimal = variant === "minimal";

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-primary)_60%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)]",
        minimal ? "self-start" : "h-full",
        className,
      )}
    >
      <div className="relative h-[150px] w-full shrink-0">
        <Image
          src={imageSrc}
          alt={imageAlt ?? title}
          fill
          sizes="(min-width: 1024px) 305px, 100vw"
          priority={priority}
          className="object-cover"
        />
        {!minimal && status ? (
          <span className="absolute right-3 top-3 inline-flex h-[var(--cb-size-24)] items-center gap-[var(--cb-space-6)] rounded-[var(--cb-radius-full)] bg-[color:color-mix(in_srgb,var(--cb-bg)_80%,transparent)] px-2.5 text-[11px] font-medium leading-4 text-[color:var(--cb-text-secondary)] backdrop-blur">
            <span
              aria-hidden
              className="h-[var(--cb-size-6)] w-[var(--cb-size-6)] rounded-[var(--cb-radius-full)] bg-[color:var(--cb-success)]"
            />
            {status}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-[var(--cb-space-4)] p-[var(--cb-space-16)]">
        <h3 className="text-[17px] font-semibold leading-6 text-[color:var(--cb-text)]">
          {title}
        </h3>
        <p className="text-[13px] leading-[19px] text-[color:var(--cb-text-muted)]">
          {description}
        </p>
        {minimal ? null : (
          <div className="mt-auto flex items-center gap-[var(--cb-space-12)] pt-[var(--cb-space-12)]">
            {tag ? (
              <span className="inline-flex h-[var(--cb-size-24)] items-center rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,transparent)] px-2.5 text-[11px] font-medium leading-4 text-[color:var(--cb-p200)]">
                {tag}
              </span>
            ) : null}
            <span className="ml-auto inline-flex items-center gap-[var(--cb-space-8)] text-sm leading-5 text-[color:var(--cb-p400)]">
              View project
              <ArrowRight
                aria-hidden
                className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export { ProjectCard };
