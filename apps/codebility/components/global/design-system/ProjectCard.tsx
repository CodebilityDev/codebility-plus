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
        "group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a] transition-colors hover:border-[#9747ff]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6A78F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030303]",
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
          <span className="absolute right-3 top-3 inline-flex h-6 items-center gap-1.5 rounded-full bg-[#030303]/80 px-2.5 text-[11px] font-medium leading-4 text-white/80 backdrop-blur">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-[#4BCE97]"
            />
            {status}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-[17px] font-semibold leading-6 text-[#f4f4f4]">
          {title}
        </h3>
        <p className="text-[13px] leading-[19px] text-white/60">
          {description}
        </p>
        {minimal ? null : (
          <div className="mt-auto flex items-center gap-3 pt-3">
            {tag ? (
              <span className="inline-flex h-6 items-center rounded-full border border-[#9747ff]/40 bg-[#9747ff]/[0.12] px-2.5 text-[11px] font-medium leading-4 text-purple-200">
                {tag}
              </span>
            ) : null}
            <span className="ml-auto inline-flex items-center gap-2 text-sm leading-5 text-[#c084fc]">
              View project
              <ArrowRight
                aria-hidden
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

export { ProjectCard };
