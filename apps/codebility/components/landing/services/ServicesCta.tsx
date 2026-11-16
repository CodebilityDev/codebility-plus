import Image from "next/image";
import Link from "next/link";

import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import {
  portfolioCta,
  portfolioCtaProjectNames,
} from "@/constants/landing/services/content";
import type {
  PortfolioData,
  PortfolioProject,
} from "@/types/landing/services/portfolio";

const collageTilt = [
  "lg:-rotate-6",
  "lg:rotate-6",
  "lg:-rotate-3",
  "lg:rotate-3",
];

export function ServicesCta({ data }: { data: PortfolioData }) {
  const named = portfolioCtaProjectNames.flatMap((name) => {
    const project = data.projects.find((item) => item.sourceName === name);

    return project ? [project] : [];
  });
  const collage = [
    ...new Map(
      [...named, ...data.projects]
        .filter((project): project is PortfolioProject & { imageSrc: string } =>
          Boolean(project.imageSrc),
        )
        .map((project) => [project.id, project]),
    ).values(),
  ].slice(0, 4);

  return (
    <section className="relative border-t border-[color:var(--cb-border)] py-[7rem]">
      <LandingContainer>
        <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:color-mix(in_srgb,var(--cb-primary)_32%,transparent)] bg-[linear-gradient(135deg,#2A0B4D_0%,#160A24_42%,#0A0A0A_78%)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_srgb,var(--cb-primary)_38%,transparent)_0%,transparent_62%)]"
          />
          <div className="relative grid gap-[var(--cb-space-32)] px-[var(--cb-space-24)] py-[var(--cb-space-32)] sm:px-[var(--cb-space-40)] sm:py-[var(--cb-space-40)] lg:min-h-[445px] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-[var(--cb-space-40)] lg:px-[var(--cb-space-64)] lg:py-[var(--cb-space-48)]">
            <div className="max-w-[460px]">
              <Eyebrow variant="outline" className="tracking-[0.14em]">
                {portfolioCta.eyebrow}
              </Eyebrow>
              <h2 className="mt-[var(--cb-space-20)] text-[32px] font-bold leading-[1.06] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[40px] lg:text-[44px]">
                {portfolioCta.titleLead}{" "}
                <span className="cb-community-text block">
                  {portfolioCta.titleAccent}
                </span>
              </h2>
              <p className="mt-[var(--cb-space-16)] max-w-[480px] text-base leading-7 text-[color:var(--cb-text-secondary)]">
                {portfolioCta.description}
              </p>
              <div className="mt-[var(--cb-space-28)] flex flex-wrap items-center gap-[var(--cb-space-12)]">
                <Button
                  asChild
                  className="shadow-[0_10px_30px_color-mix(in_srgb,var(--cb-primary)_45%,transparent)]"
                >
                  <Link href={portfolioCta.primaryHref}>
                    {portfolioCta.primaryLabel}
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={portfolioCta.secondaryHref}>
                    {portfolioCta.secondaryLabel}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[var(--cb-space-12)] sm:gap-[var(--cb-space-16)] lg:-my-[var(--cb-space-16)] lg:-mr-[var(--cb-space-64)]">
              {collage.map((project, index) => (
                <div
                  key={project.id}
                  className={cn(
                    "relative aspect-[16/10] overflow-hidden rounded-[var(--cb-radius-12)] border border-[color:color-mix(in_srgb,var(--cb-white)_20%,transparent)] bg-[color:var(--cb-surface-2)] shadow-[0_24px_50px_rgba(0,0,0,0.45)]",
                    index % 2 === 0 ? "lg:-translate-x-2" : "lg:translate-x-6",
                    index < 2 ? "lg:-translate-y-2" : "lg:translate-y-2",
                    collageTilt[index],
                  )}
                >
                  <Image
                    src={project.imageSrc}
                    alt={project.name}
                    fill
                    sizes="(min-width: 1024px) 24vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </LandingContainer>
    </section>
  );
}
