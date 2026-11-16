import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  ExternalLink,
} from "lucide-react";
import type { ComponentType } from "react";

import { Avatar } from "@/components/global/design-system/Avatar";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { Rating } from "@/components/global/design-system/Rating";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { portfolioProof } from "@/constants/landing/services/content";
import type {
  PortfolioData,
  PortfolioProject,
} from "@/types/landing/services/portfolio";

function projectHref(project: PortfolioProject) {
  return `/services?project=${encodeURIComponent(project.id)}`;
}

const statIcons: Record<string, ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  external: ExternalLink,
  building: Building2,
  award: Award,
};

export function ServicesProof({ data }: { data: PortfolioData }) {
  const { projects } = data;
  const statValues = Object.fromEntries(
    portfolioProof.stats.map((stat) => [stat.icon, stat.value]),
  );
  const testimonial = portfolioProof.testimonial;
  const project =
    projects.find((item) => item.sourceName === testimonial.projectName) ??
    projects[0];

  return (
    <section className="relative border-t border-[color:var(--cb-border)] py-[7rem]">
      <LandingContainer className="grid gap-[var(--cb-space-40)] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-[var(--cb-space-56)]">
        <div>
          <Eyebrow variant="outline" className="tracking-[0.12em]">
            {portfolioProof.eyebrow}
          </Eyebrow>
          <h2 className="mt-[var(--cb-space-16)] text-[32px] font-bold leading-9 tracking-tight text-[color:var(--cb-text)] md:text-[44px] md:leading-[48px]">
            {portfolioProof.titleLead}{" "}
            <span className="cb-community-text">{portfolioProof.titleAccent}</span>
          </h2>
          <p className="mt-[var(--cb-space-12)] max-w-[560px] text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg">
            {portfolioProof.description}
          </p>

          <div className="mt-[var(--cb-space-32)] grid grid-cols-2 gap-[var(--cb-space-16)]">
            {portfolioProof.stats.map((stat) => {
              const Icon = statIcons[stat.icon] ?? Briefcase;

              return (
                <div
                  key={stat.label}
                  className="min-h-[170px] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-20)]"
                >
                  <div className="flex items-center gap-[var(--cb-space-12)]">
                    <span className="flex h-[var(--cb-size-36)] w-[var(--cb-size-36)] shrink-0 items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] text-[color:var(--cb-p300)]">
                      <Icon
                        aria-hidden
                        className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                      />
                    </span>
                    <p className="cb-metric-text text-[36px] font-bold leading-10 tracking-[-0.02em] sm:text-[48px]">
                      {statValues[stat.icon] ?? stat.value}
                    </p>
                  </div>
                  <p className="mt-[var(--cb-space-16)] text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
                    {stat.label}
                  </p>
                  <p className="mt-[var(--cb-space-4)] text-[13px] leading-5 text-[color:var(--cb-text-muted)]">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -bottom-12 top-8 rounded-[48px] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_30%,transparent)_0%,transparent_70%)] blur-3xl"
          />
          <div className="relative min-h-[375px] overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[#0A0E0E] p-[var(--cb-space-32)] shadow-[0_0_70px_rgba(151,71,255,0.18)]">
            <Rating value={5} size="md" />
            <blockquote className="mt-[var(--cb-space-20)] text-lg leading-[1.6] text-[color:var(--cb-text-secondary)] sm:text-xl">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-[var(--cb-space-24)] flex items-center gap-[var(--cb-space-12)]">
              <Avatar
                initials={testimonial.initials}
                alt={testimonial.name}
                size={48}
                gradient="violet"
              />
              <div>
                <p className="text-[15px] font-semibold leading-5 text-[color:var(--cb-text)]">
                  {testimonial.name}
                </p>
                <p className="mt-[var(--cb-space-2)] text-sm leading-5 text-[color:var(--cb-text-muted)]">
                  {testimonial.role}
                </p>
              </div>
            </div>

            {project ? (
              <div className="mt-[var(--cb-space-24)] flex items-center gap-[var(--cb-space-12)] border-t border-[color:var(--cb-border)] pt-[var(--cb-space-20)]">
                <div className="relative h-[32px] w-[44px] shrink-0 overflow-hidden rounded-[var(--cb-radius-8)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface-2)]">
                  {project.imageSrc ? (
                    <Image
                      src={project.imageSrc}
                      alt={project.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <p className="line-clamp-2 min-w-0 flex-1 text-[13px] leading-5 text-[color:var(--cb-text-muted)]">
                  {testimonial.projectLabel}: {project.name}
                </p>
                <Link
                  href={projectHref(project)}
                  className="inline-flex shrink-0 items-center gap-[var(--cb-space-6)] text-[13px] font-medium text-[color:var(--cb-p400)] transition-colors hover:text-[color:var(--cb-text)]"
                >
                  View project
                  <ArrowRight
                    aria-hidden
                    className="h-[var(--cb-size-14)] w-[var(--cb-size-14)]"
                  />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
