"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, Globe, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import {
  portfolioFeaturedCopy,
  portfolioFeaturedName,
  portfolioHref,
} from "@/constants/landing/services/content";
import type {
  PortfolioCategoryId,
  PortfolioProject,
} from "@/types/landing/services/portfolio";

const featureIcons: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  globe: Globe,
  sparkles: Sparkles,
  users: Users,
};

const platformLabels: Record<
  Exclude<PortfolioCategoryId, "all">,
  string
> = {
  "web-apps": "Web application",
  "cms-storefronts": "E-commerce storefront",
  "mobile-apps": "Mobile application",
  "product-design": "Product design",
  "ai-development": "AI-powered platform",
};

function platformLabel(project: PortfolioProject) {
  const primary = project.categories[0];
  return primary ? platformLabels[primary] : "Web application";
}

function FeatureItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  const Icon = featureIcons[icon] ?? Sparkles;

  return (
    <div className="flex items-start gap-[var(--cb-space-12)]">
      <span className="flex h-[var(--cb-size-36)] w-[var(--cb-size-36)] shrink-0 items-center justify-center rounded-[10px] border border-[color:color-mix(in_srgb,var(--cb-primary)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_14%,transparent)] text-[color:var(--cb-p300)]">
        <Icon
          aria-hidden
          className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
        />
      </span>
      <div className="flex flex-col gap-[var(--cb-space-2)]">
        <span className="text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
          {label}
        </span>
        <span className="text-[13px] leading-[19px] text-[color:var(--cb-text-muted)]">
          {value}
        </span>
      </div>
    </div>
  );
}

export function ServicesFeatured({
  project,
  secondary,
}: {
  project: PortfolioProject | undefined;
  secondary: PortfolioProject[];
}) {
  const slides = project ? [project, ...secondary] : secondary;
  const thumbnailSlides = project ? [...secondary, project] : secondary;
  const [activeId, setActiveId] = useState(slides[0]?.id ?? "");
  const [announce, setAnnounce] = useState(false);
  const active = slides.find((item) => item.id === activeId) ?? slides[0];
  const slideIds = slides.map((item) => item.id).join("|");

  useEffect(() => {
    const ids = slideIds ? slideIds.split("|") : [];

    if (ids.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (document.visibilityState === "hidden") return;

      setActiveId((current) => {
        const index = ids.indexOf(current);
        return ids[(index + 1) % ids.length] ?? current;
      });
      setAnnounce(false);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [activeId, slideIds]);

  if (!active) return null;

  const isFeatured = project?.id === active.id;
  const features = isFeatured
    ? portfolioFeaturedCopy.features
    : [
        { icon: "briefcase", label: "Category", value: active.badge },
        { icon: "globe", label: "Platform", value: platformLabel(active) },
        {
          icon: "sparkles",
          label: "Status",
          value: active.websiteUrl ? "Live in production" : "Selected work",
        },
        { icon: "users", label: "Team", value: "Codebility CoDevs" },
      ];
  const title = isFeatured ? portfolioFeaturedCopy.title : active.name;
  const description = isFeatured
    ? portfolioFeaturedCopy.description
    : active.description;
  const href = portfolioHref({ project: active.id });

  return (
    <section className="pb-[var(--cb-space-64)] sm:pb-[var(--cb-space-80)] lg:pb-[var(--cb-space-96)]">
      <LandingContainer className="flex flex-col gap-[var(--cb-space-16)]">
        <article
          id="featured-project-panel"
          aria-label="Featured project"
          className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] shadow-[0_0_80px_-32px_color-mix(in_srgb,var(--cb-primary)_45%,transparent)]"
        >
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="relative flex flex-col justify-between gap-[var(--cb-space-32)] p-[var(--cb-space-24)] sm:p-[var(--cb-space-32)] lg:px-[var(--cb-space-40)] lg:py-[var(--cb-space-40)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_95%_at_0%_0%,color-mix(in_srgb,var(--cb-primary)_30%,transparent)_0%,transparent_68%)]"
              />

              <div
                key={active.id}
                aria-live={announce ? "polite" : "off"}
                className="cb-portfolio-slide-left relative"
              >
                <div className="flex flex-wrap items-center gap-[var(--cb-space-12)]">
                  <Eyebrow variant="outline" className="tracking-[0.14em]">
                    {portfolioFeaturedCopy.eyebrow}
                  </Eyebrow>
                  {active.websiteUrl ? (
                    <span className="inline-flex h-[var(--cb-size-28)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-success)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-success)_14%,transparent)] px-[var(--cb-space-16)] text-xs font-semibold leading-[18px] text-[color:var(--cb-success-text)]">
                      <span
                        aria-hidden
                        className="h-[6px] w-[6px] rounded-[var(--cb-radius-full)] bg-[color:var(--cb-success)]"
                      />
                      {portfolioFeaturedCopy.liveLabel}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-[var(--cb-space-20)] text-[32px] font-bold leading-[1.06] tracking-[-0.03em] text-[color:var(--cb-text)] lg:text-[40px]">
                  {title}
                </h2>

                <p className="mt-[var(--cb-space-12)] max-w-[480px] text-base leading-[1.7] text-[color:var(--cb-text-muted)]">
                  {description}
                </p>

                <div className="mt-[var(--cb-space-28)] grid gap-x-[var(--cb-space-32)] gap-y-[var(--cb-space-20)] sm:grid-cols-2">
                  {features.map((feature) => (
                    <FeatureItem
                      key={feature.label}
                      icon={feature.icon}
                      label={feature.label}
                      value={feature.value}
                    />
                  ))}
                </div>
              </div>

              <div className="relative flex flex-wrap items-center gap-[var(--cb-space-12)]">
                <Button
                  asChild
                  className="shadow-[0_0_32px_color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
                >
                  <Link href={href}>
                    {portfolioFeaturedCopy.viewLabel}
                    <ArrowRight
                      aria-hidden
                      className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                    />
                  </Link>
                </Button>
                {active.websiteUrl ? (
                  <Button asChild variant="outline">
                    <a
                      href={active.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {portfolioFeaturedCopy.liveCta}
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div
              key={active.id}
              className="cb-portfolio-slide-right relative aspect-[4/3] w-full overflow-hidden bg-[color:var(--cb-surface-2)] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[470px]"
            >
              {active.imageSrc ? (
                <Image
                  key={active.id}
                  src={active.imageSrc}
                  alt={active.name}
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  loading="eager"
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_16%,transparent),var(--cb-surface-2)_70%)]"
                />
              )}
            </div>
          </div>
        </article>

        <div
          role="group"
          aria-label="Featured project thumbnails"
          tabIndex={0}
          className="scrollbar-hide flex snap-x snap-mandatory gap-[var(--cb-space-16)] overflow-x-auto pb-[var(--cb-space-4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
        >
          {thumbnailSlides.map((item) => {
            const meta =
              item.sourceName === portfolioFeaturedName
                ? portfolioFeaturedCopy.thumbnailMeta
                : item.description;
            const selected = item.id === active.id;

            return (
            <button
              key={item.id}
              type="button"
              aria-controls="featured-project-panel"
              aria-label={`Show ${item.name}`}
              aria-pressed={selected}
              onClick={() => {
                setActiveId(item.id);
                setAnnounce(true);
              }}
              className={cn(
                "group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-[var(--cb-radius-16)] border bg-[color:var(--cb-surface-2)] text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cb-bg)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]",
                selected
                  ? "border-[color:color-mix(in_srgb,var(--cb-primary)_65%,transparent)] ring-1 ring-[color:color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
                  : "border-[color:var(--cb-border)] hover:border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)]",
              )}
            >
              <span className="relative block aspect-[2.05/1] w-full overflow-hidden bg-[color:var(--cb-surface)]">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_16%,transparent),var(--cb-surface)_70%)]"
                  />
                )}
              </span>

              <span className="flex flex-1 flex-col gap-[var(--cb-space-4)] p-[var(--cb-space-20)]">
                <span className="text-[17px] font-semibold leading-5 text-[color:var(--cb-text)]">
                  {item.name}
                </span>
                <span className="line-clamp-1 text-[13px] leading-4 text-[color:var(--cb-text-muted)]">
                  {meta}
                </span>
              </span>
            </button>
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}
