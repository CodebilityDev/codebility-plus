import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Globe,
  Layers,
  LayoutTemplate,
  MonitorSmartphone,
  Palette,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { ProjectScreens } from "@/components/landing/services/ProjectScreens";
import {
  portfolioCategories,
  portfolioPlatformLabels,
  portfolioProjectDetailCopy,
  portfolioProjectDetails,
  portfolioProjectHref,
  portfolioServiceLabels,
} from "@/constants/landing/services/content";
import type {
  PortfolioProject,
  PortfolioProjectDetail,
  PortfolioScreen,
} from "@/types/landing/services/portfolio";

const featureIcons: Record<string, LucideIcon> = {
  template: LayoutTemplate,
  palette: Palette,
  nfc: CreditCard,
  devices: MonitorSmartphone,
  layers: Layers,
  globe: Globe,
  sparkles: Sparkles,
  users: Users,
};

const defaultScreens: PortfolioScreen[] = [
  {
    id: "web-overview",
    label: "Web overview",
    tab: "Web",
    mode: "browser",
    objectPosition: "0% 50%",
  },
  {
    id: "web-detail",
    label: "Product detail",
    tab: "Web",
    mode: "browser",
    objectPosition: "100% 50%",
  },
  {
    id: "mobile",
    label: "Mobile experience",
    tab: "Mobile",
    mode: "phone",
    objectPosition: "50% 50%",
  },
  {
    id: "details",
    label: "Experience details",
    tab: "Cards",
    mode: "phone",
    objectPosition: "0% 50%",
  },
];

function domainFromUrl(value?: string) {
  if (!value) return undefined;

  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function platformFor(project: PortfolioProject) {
  return project.categories
    .map((category) => portfolioPlatformLabels[category])
    .join(" · ");
}

function serviceFor(project: PortfolioProject) {
  const primary = project.categories[0];
  return primary ? portfolioServiceLabels[primary] : project.badge;
}

function featuresFor(project: PortfolioProject) {
  const override = portfolioProjectDetails[project.sourceName]?.features;
  if (override) return override;

  const service = serviceFor(project);

  return [
    {
      icon: "layers",
      title: service,
      description: "The core product experience, shaped around this service.",
    },
    {
      icon: "globe",
      title: "Responsive by default",
      description: "Built to work clearly across desktop and mobile.",
    },
    {
      icon: "sparkles",
      title: project.websiteUrl ? "Live in production" : "Selected work",
      description: project.websiteUrl
        ? "Available to use today at the live product."
        : "A project built for a real product and audience.",
    },
    {
      icon: "users",
      title: "Codebility CoDevs",
      description: "Designed and shipped by a cross-functional team.",
    },
  ];
}

function BrowserPreview({ project }: { project: PortfolioProject }) {
  const domain = domainFromUrl(project.websiteUrl) ?? project.name;

  return (
    <div className="mt-[var(--cb-space-32)] overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:var(--cb-border)] bg-[#0B0B0D] shadow-[0_0_90px_-36px_color-mix(in_srgb,var(--cb-primary)_45%,transparent)]">
      <div className="flex h-[var(--cb-size-44)] items-center gap-[var(--cb-space-8)] border-b border-[color:var(--cb-border)] bg-[#080808] px-[var(--cb-space-16)]">
        <span className="h-[10px] w-[10px] rounded-full bg-[#FF5F57]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#FEBC2E]" />
        <span className="h-[10px] w-[10px] rounded-full bg-[#28C840]" />
        <span className="mx-auto min-w-0 max-w-[420px] flex-1 truncate rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] px-[var(--cb-space-16)] py-[var(--cb-space-2)] text-center text-[11px] leading-5 text-[color:var(--cb-text-muted)]">
          {domain}
        </span>
        <span className="w-[46px]" aria-hidden />
      </div>

      <div className="relative aspect-[2.35/1] w-full overflow-hidden bg-[#111]">
        {project.imageSrc ? (
          <Image
            src={project.imageSrc}
            alt={`${project.name} homepage`}
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-primary)_20%,transparent),#0A0A0A_72%)] text-3xl font-semibold text-[color:var(--cb-text-muted)]">
            {project.name}
          </div>
        )}
      </div>
    </div>
  );
}

function MetaStrip({ project }: { project: PortfolioProject }) {
  const detail = portfolioProjectDetails[project.sourceName];
  const domain = domainFromUrl(project.websiteUrl);
  const items = [
    { label: "Client", value: project.name },
    { label: "Service", value: detail?.service ?? serviceFor(project) },
    {
      label: "Platform",
      value: detail?.platform ?? (platformFor(project) || project.badge),
    },
    {
      label: "Status",
      value: project.websiteUrl
        ? domain
          ? `Live at ${domain}`
          : "Live in production"
        : "Selected work",
    },
  ];

  return (
    <dl className="mt-[var(--cb-space-16)] grid grid-cols-2 border-y border-[color:var(--cb-border)] md:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={
            "flex flex-col gap-[var(--cb-space-8)] py-[var(--cb-space-24)] " +
            (index === 1 || index === 3
              ? "border-l border-[color:var(--cb-border)] pl-[var(--cb-space-24)] "
              : "") +
            (index === 2
              ? "md:border-l md:border-[color:var(--cb-border)] md:pl-[var(--cb-space-24)] "
              : "") +
            (index >= 2 ? "border-t border-[color:var(--cb-border)] md:border-t-0" : "")
          }
        >
          <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--cb-text-muted)]">
            {item.label}
          </dt>
          <dd className="text-[15px] font-medium leading-5 text-[color:var(--cb-text)]">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function NeighborCard({
  project,
  direction,
}: {
  project: PortfolioProject;
  direction: "previous" | "next";
}) {
  const label =
    direction === "previous"
      ? portfolioProjectDetailCopy.previousProject
      : portfolioProjectDetailCopy.nextProject;
  const Icon = direction === "previous" ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={portfolioProjectHref(project.id)}
      className="group flex items-center gap-[var(--cb-space-20)] rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-16)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-primary)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
    >
      <div className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface-2)]">
        {project.imageSrc ? (
          <Image
            src={project.imageSrc}
            alt={project.name}
            fill
            sizes="120px"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-[color:var(--cb-text-muted)]">
            {project.badge}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-[var(--cb-space-6)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--cb-text-muted)]">
          {direction === "previous" ? <ArrowLeft className="h-3 w-3" /> : null}
          {label}
          {direction === "next" ? <ArrowRight className="h-3 w-3" /> : null}
        </p>
        <p className="mt-[var(--cb-space-6)] truncate text-lg font-semibold text-[color:var(--cb-text)]">
          {project.name}
        </p>
        <p className="mt-[var(--cb-space-2)] text-[13px] text-[color:var(--cb-text-muted)]">
          {project.badge}
          {project.websiteUrl ? " · Live" : ""}
        </p>
      </div>
      <Icon
        aria-hidden
        className="ml-auto h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0 text-[color:var(--cb-text-muted)] transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function ProjectDetail({ detail }: { detail: PortfolioProjectDetail }) {
  const project = detail.project;
  if (!project) return null;

  const primaryCategory = project.categories[0];
  const category =
    portfolioCategories.find((item) => item.id === primaryCategory) ?? {
      id: "web-apps" as const,
      label: "Web Apps",
      badge: "Web App",
      icon: "globe",
    };
  const detailOverride = portfolioProjectDetails[project.sourceName];
  const screens = detailOverride?.screens ?? defaultScreens;
  const features = featuresFor(project);
  const domain = domainFromUrl(project.websiteUrl);

  return (
    <>
      <section className="relative overflow-hidden pb-[var(--cb-space-64)] pt-[var(--cb-space-40)] sm:pt-[var(--cb-space-48)] lg:pb-[var(--cb-space-80)]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_78%_110%_at_22%_0%,color-mix(in_srgb,var(--cb-primary)_32%,transparent)_0%,transparent_72%)]" />
          <div className="absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_80%_90%_at_70%_0%,color-mix(in_srgb,var(--cb-primary)_14%,transparent)_0%,transparent_70%)]" />
        </div>

        <LandingContainer className="relative">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-[var(--cb-space-8)] text-xs leading-5 text-[color:var(--cb-text-muted)]"
          >
            <Link
              href="/services"
              className="transition-colors hover:text-[color:var(--cb-text)]"
            >
              Services
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/services?category=${category.id}`}
              className="transition-colors hover:text-[color:var(--cb-text)]"
            >
              {category.badge}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[color:var(--cb-text-secondary)]">
              {project.name}
            </span>
          </nav>

          <div className="mt-[var(--cb-space-24)] flex flex-col gap-[var(--cb-space-24)] lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <div className="flex flex-wrap items-center gap-[var(--cb-space-8)]">
                <span className="inline-flex h-[var(--cb-size-24)] items-center rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] px-[var(--cb-space-10)] text-[11px] font-medium leading-4 text-[color:var(--cb-text-secondary)]">
                  {project.badge}
                </span>
                {project.websiteUrl ? (
                  <span className="inline-flex h-[var(--cb-size-24)] items-center gap-[var(--cb-space-6)] rounded-[var(--cb-radius-full)] border border-[color:color-mix(in_srgb,var(--cb-success)_28%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-success)_12%,transparent)] px-[var(--cb-space-10)] text-[11px] font-medium leading-4 text-[color:var(--cb-success-text)]">
                    <span className="h-[6px] w-[6px] rounded-full bg-[color:var(--cb-success)]" />
                    Live
                  </span>
                ) : null}
              </div>

              <h1 className="mt-[var(--cb-space-16)] text-[44px] font-bold leading-[1.02] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[56px] lg:text-[64px]">
                {project.name}
              </h1>
              <p className="mt-[var(--cb-space-16)] max-w-[640px] text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-[var(--cb-space-12)] lg:shrink-0">
              <Button asChild variant="outline">
                <Link href="/services">
                  {portfolioProjectDetailCopy.allProjects}
                  <ArrowRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
                </Link>
              </Button>
              {project.websiteUrl ? (
                <Button asChild>
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {portfolioProjectDetailCopy.visitLive}
                    <ExternalLink className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <BrowserPreview project={project} />
          <MetaStrip project={project} />
        </LandingContainer>
      </section>

      <section className="border-t border-[color:var(--cb-border)] py-[7rem]">
        <LandingContainer className="grid gap-[var(--cb-space-40)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-[var(--cb-space-56)]">
          <div>
            <Eyebrow variant="outline" className="tracking-[0.12em]">
              {portfolioProjectDetailCopy.featuresEyebrow}
            </Eyebrow>
            <h2 className="mt-[var(--cb-space-16)] text-[32px] font-bold leading-9 tracking-tight text-[color:var(--cb-text)] md:text-[44px] md:leading-[48px]">
              {portfolioProjectDetailCopy.featuresTitle}{" "}
              <span className="cb-community-text">{project.name}</span>
            </h2>
            <p className="mt-[var(--cb-space-12)] max-w-[420px] text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg">
              {portfolioProjectDetailCopy.featuresDescription}
            </p>
          </div>

          <div className="grid gap-[var(--cb-space-16)] sm:grid-cols-2">
            {features.map((feature) => {
              const Icon = featureIcons[feature.icon] ?? Sparkles;

              return (
                <div
                  key={feature.title}
                  className="rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)]"
                >
                  <span className="flex h-[var(--cb-size-32)] w-[var(--cb-size-32)] items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] text-[color:var(--cb-p300)]">
                    <Icon
                      aria-hidden
                      className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
                    />
                  </span>
                  <h3 className="mt-[var(--cb-space-16)] text-base font-semibold leading-5 text-[color:var(--cb-text)]">
                    {feature.title}
                  </h3>
                  <p className="mt-[var(--cb-space-4)] text-[13px] leading-5 text-[color:var(--cb-text-muted)]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </LandingContainer>
      </section>

      <ProjectScreens
        screens={screens}
        imageSrc={project.imageSrc}
        name={project.name}
        domain={domain}
      />

      <section className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-64)]">
        <LandingContainer className="grid gap-[var(--cb-space-16)] md:grid-cols-2">
          {detail.previous ? (
            <NeighborCard project={detail.previous} direction="previous" />
          ) : null}
          {detail.next ? (
            <NeighborCard project={detail.next} direction="next" />
          ) : null}
        </LandingContainer>
      </section>

      <section className="pb-[7rem]">
        <LandingContainer>
          <div className="relative overflow-hidden rounded-[var(--cb-radius-24)] border border-[color:color-mix(in_srgb,var(--cb-primary)_28%,transparent)] bg-[linear-gradient(135deg,#2A0B4D_0%,#160A24_44%,#0A0A0A_82%)] px-[var(--cb-space-24)] py-[var(--cb-space-48)] text-center sm:px-[var(--cb-space-40)] sm:py-[var(--cb-space-64)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_srgb,var(--cb-primary)_38%,transparent)_0%,transparent_62%)]"
            />
            <div className="relative mx-auto max-w-[760px]">
              <Eyebrow variant="outline" className="tracking-[0.14em]">
                {portfolioProjectDetailCopy.buildEyebrow}
              </Eyebrow>
              <h2 className="mt-[var(--cb-space-20)] text-[32px] font-bold leading-[1.08] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[40px] lg:text-[44px]">
                Want a product like{" "}
                <span className="cb-community-text">{project.name}</span>?
              </h2>
              <p className="mx-auto mt-[var(--cb-space-12)] max-w-[520px] text-base leading-7 text-[color:var(--cb-text-secondary)]">
                {portfolioProjectDetailCopy.buildDescription}
              </p>
              <div className="mt-[var(--cb-space-24)] flex flex-wrap items-center justify-center gap-[var(--cb-space-12)]">
                <Button asChild>
                  <Link href={portfolioProjectDetailCopy.buildPrimaryHref}>
                    {portfolioProjectDetailCopy.buildPrimary}
                    <ArrowRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={portfolioProjectDetailCopy.buildSecondaryHref}>
                    {portfolioProjectDetailCopy.buildSecondary}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </LandingContainer>
      </section>
    </>
  );
}
