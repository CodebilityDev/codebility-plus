import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { portfolioHero } from "@/constants/landing/services/content";

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden pb-[var(--cb-space-40)] pt-[var(--cb-space-40)] sm:pb-[var(--cb-space-32)] sm:pt-[var(--cb-space-48)] lg:pt-[116px]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_72%_110%_at_12%_0%,color-mix(in_srgb,var(--cb-primary)_48%,transparent)_0%,color-mix(in_srgb,var(--cb-primary)_22%,transparent)_38%,transparent_74%)]" />
        <div className="absolute inset-x-0 top-0 h-[22rem] bg-[radial-gradient(ellipse_90%_90%_at_58%_0%,color-mix(in_srgb,var(--cb-primary)_14%,transparent)_0%,transparent_68%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[10rem] bg-gradient-to-t from-[color:var(--cb-bg)] to-transparent" />
      </div>

      <LandingContainer className="relative flex flex-col gap-[var(--cb-space-32)] xl:flex-row xl:items-end xl:justify-between xl:gap-[var(--cb-space-64)]">
        <div className="max-w-[600px]">
          <Eyebrow variant="outline" className="tracking-[0.14em]">
            {portfolioHero.eyebrow}
          </Eyebrow>

          <h1 className="mt-[var(--cb-space-24)] w-full max-w-full break-words text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-[color:var(--cb-text)] sm:text-[54px] lg:text-[68px] lg:leading-[1.02]">
            {portfolioHero.title}{" "}
            <span className="cb-community-text block">
              {portfolioHero.accent}
            </span>
          </h1>

          <p className="mt-[var(--cb-space-20)] max-w-[610px] text-base leading-7 text-[color:var(--cb-text-muted)] sm:text-lg">
            {portfolioHero.description}
          </p>
        </div>

        <dl className="grid w-full grid-cols-3 gap-[var(--cb-space-16)] sm:grid-cols-[auto_auto_auto] sm:justify-start sm:gap-[var(--cb-space-24)] xl:w-auto xl:shrink-0 xl:gap-[var(--cb-space-48)]">
          {portfolioHero.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse justify-end gap-[var(--cb-space-6)]"
            >
              <dt className="text-[12px] leading-5 text-[color:var(--cb-text-muted)] sm:text-[13px] sm:whitespace-nowrap">
                {stat.label}
              </dt>
              <dd className="cb-metric-text text-[28px] font-semibold leading-none sm:text-[32px]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </LandingContainer>
    </section>
  );
}
