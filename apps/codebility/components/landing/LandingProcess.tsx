import Link from "next/link";

import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import { SectionHeader } from "@/components/global/design-system/SectionHeader";
import { Step } from "@/components/global/design-system/Step";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { processSteps } from "@/constants/landing/landing-content";

const accentClasses =
  "whitespace-nowrap bg-gradient-to-b from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent";

function LandingProcess() {
  return (
    <section id="process" className="border-t border-white/10 py-24 lg:py-32">
      <LandingContainer className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
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

        <div className="flex flex-col gap-2">
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