import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@codevs/ui";

import { IconTile } from "@/components/global/design-system/IconTile";
import { TextLink } from "@/components/global/design-system/TextLink";

export interface ServiceCardProps {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

function ServiceCard({
  eyebrow,
  title,
  description,
  icon,
  imageSrc,
  imageAlt,
  ctaLabel,
  ctaHref,
  className,
}: ServiceCardProps) {
  return (
    <div
      className={cn(
        "group relative flex h-[292px] flex-col justify-end overflow-hidden rounded-[20px] border border-[color:var(--cb-border)] bg-[color:var(--cb-bg)] p-[var(--cb-space-24)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)]",
        className,
      )}
    >
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[var(--cb-bg)] via-[color:color-mix(in_srgb,var(--cb-bg)_65%,transparent)] to-transparent"
          />
        </>
      ) : (
        <>
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,var(--cb-focus-glow),transparent_60%)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(var(--cb-border) 1px, transparent 1px), linear-gradient(90deg, var(--cb-border) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "linear-gradient(to top, transparent, black 70%)",
              WebkitMaskImage:
                "linear-gradient(to top, transparent, black 70%)",
            }}
          />
        </>
      )}
      {icon ? (
        <IconTile
          variant="glass"
          className="absolute left-[var(--cb-space-24)] top-[var(--cb-space-24)] z-20 h-[var(--cb-size-48)] w-[var(--cb-size-48)] border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,transparent)] text-[color:var(--cb-p300)]"
        >
          {icon}
        </IconTile>
      ) : null}
      <div className="relative z-10 flex max-w-[440px] flex-col gap-[var(--cb-space-8)]">
        <span className="text-[11px] font-semibold uppercase leading-4 tracking-[0.2em] text-[color:var(--cb-text-muted)]">
          {eyebrow}
        </span>
        <h3 className="text-xl font-semibold leading-7 tracking-[-0.02em] text-[color:var(--cb-text)]">
          {title}
        </h3>
        <p className="text-sm leading-5 text-[color:var(--cb-text-muted)]">{description}</p>
        {ctaLabel && ctaHref ? (
          <TextLink asChild className="mt-[var(--cb-space-4)] text-sm leading-5">
            <Link href={ctaHref}>
              {ctaLabel}
              <ArrowRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          </TextLink>
        ) : null}
      </div>
    </div>
  );
}

export { ServiceCard };
