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
        "relative flex h-[300px] flex-col justify-end gap-2 overflow-hidden rounded-3xl border border-white/10 bg-[#030303] p-6 transition-colors hover:border-white/20",
        className,
      )}
    >
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/70 to-transparent"
          />
        </>
      ) : (
        <>
          <span
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(151,71,255,0.3),transparent_60%)]"
          />
          <span
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(244,244,244,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244,244,244,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "linear-gradient(to top, transparent, black 70%)",
              WebkitMaskImage:
                "linear-gradient(to top, transparent, black 70%)",
            }}
          />
        </>
      )}
      {icon ? (
        <IconTile className="relative z-10 [&>svg]:h-[18px] [&>svg]:w-[18px]">
          {icon}
        </IconTile>
      ) : null}
      <span className="relative z-10 text-xs font-semibold uppercase leading-[18px] tracking-[0.2em] text-white/60">
        {eyebrow}
      </span>
      <h3 className="relative z-10 text-2xl font-semibold leading-[30px] text-[#f4f4f4]">
        {title}
      </h3>
      <p className="relative z-10 text-sm text-white/60">{description}</p>
      {ctaLabel && ctaHref ? (
        <TextLink asChild className="relative z-10 mt-1">
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </TextLink>
      ) : null}
    </div>
  );
}

export { ServiceCard };
