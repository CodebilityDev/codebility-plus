import Link from "next/link";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { Step } from "@/components/global/design-system/Step";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { processSteps } from "@/constants/landing/landing-content";

const accentClasses = "cb-accent-text whitespace-nowrap";

function LandingProcess() {
  return (
    <section
      id="process"
      className="relative overflow-hidden border-t border-[color:var(--cb-border)] pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[119px] lg:pt-[112px]"
    >
      <LandingContainer className="relative z-10 grid gap-[var(--cb-space-40)] lg:grid-cols-[1fr_1.08fr] lg:items-center lg:gap-[var(--cb-space-24)]">
        <div className="flex flex-col items-start">
          <Eyebrow variant="outline">OUR PROCESS</Eyebrow>
          <h2 className="mt-[var(--cb-space-12)] max-w-[604px] text-[32px] font-bold leading-9 tracking-[-0.03em] text-[color:var(--cb-text)] md:text-[48px] md:leading-[52px]">
            From first call to <span className={accentClasses}>launch day</span>
          </h2>
          <p className="mt-[var(--cb-space-28)] max-w-[520px] text-lg leading-7 text-[color:var(--cb-text-muted)]">
            A clear, four-step path. You always know who's on your team, what
            ships next and when.
          </p>
          <div className="mt-[var(--cb-space-40)] flex flex-wrap gap-[var(--cb-space-16)]">
            <Button
              asChild
              className="shadow-[0_0_36px_color-mix(in_srgb,var(--cb-primary)_35%,transparent)]"
            >
              <Link href="/bookacall">Book a Strategy Call</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#services">View Our Built Apps</Link>
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col gap-[19px]">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[22rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--cb-teal)_20%,transparent)_0%,color-mix(in_srgb,var(--cb-teal)_8%,transparent)_30%,transparent_65%)] sm:h-[28rem] sm:w-[36rem] lg:h-[32rem] lg:w-[44rem]"
          />
          {processSteps.map((step, index) => (
            <Step
              key={step.number}
              status={step.active ? "active" : "upcoming"}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
              meta={step.meta}
            />
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

export { LandingProcess };
