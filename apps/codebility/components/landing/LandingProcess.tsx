import Link from "next/link";

import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { Step } from "@/components/global/design-system/Step";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { processSteps } from "@/constants/landing/landing-content";

const accentClasses = "cb-accent-text whitespace-nowrap";

function LandingProcess() {
  return (
    <section id="process" className="border-t border-[color:var(--cb-border)] py-[var(--cb-space-96)] lg:py-32">
      <LandingContainer className="grid gap-[var(--cb-space-40)] lg:grid-cols-2 lg:items-start lg:gap-[var(--cb-space-64)]">
        <SectionHeader
          eyebrowVariant="outline"
          eyebrow="OUR PROCESS"
          title={
            <>
              From first call to{" "}
              <span className={accentClasses}>launch day</span>
            </>
          }
          description="A clear, four-step path. You always know who's on your team, what ships next and where."
          actions={
            <>
              <Button asChild>
                <Link href="/bookacall">Book a Strategy Call</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="#services">View Our Built Apps</Link>
              </Button>
            </>
          }
        />

        <div className="flex flex-col gap-[var(--cb-space-8)]">
          {processSteps.map((step, index) => (
            <Step
              key={step.number}
              status={step.active ? "active" : "upcoming"}
              stepNumber={index + 1}
              title={step.title}
              description={step.description}
              meta={step.meta}
              className={cn("h-auto min-h-[86px]")}
            />
          ))}
        </div>
      </LandingContainer>
    </section>
  );
}

export { LandingProcess };