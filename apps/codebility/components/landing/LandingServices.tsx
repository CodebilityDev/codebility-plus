import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@codevs/ui";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { ServiceCard } from "@/components/global/design-system/ServiceCard";
import { LandingContainer } from "@/components/landing/LandingContainer";
import { services } from "@/constants/landing/landing-content";

function LandingServices() {
  return (
    <section
      id="services"
      className="border-t border-[color:var(--cb-border)] pb-[var(--cb-space-96)] pt-[var(--cb-space-96)] lg:pb-[138px] lg:pt-[112px]"
    >
      <LandingContainer>
        <div className="flex flex-col gap-[var(--cb-space-24)] lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-[var(--cb-space-18)]">
            <Eyebrow variant="outline">WHAT WE BUILD</Eyebrow>
            <h2 className="max-w-[780px] text-[32px] font-bold leading-9 tracking-[-0.04em] text-[color:var(--cb-text)] md:text-[48px] md:leading-[52px]">
              Strategy, design and engineering
              <span className="cb-accent-text block">under one roof</span>
            </h2>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-fit lg:mb-[var(--cb-space-8)]"
          >
            <Link href="/services">
              All services
              <ArrowRight className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
            </Link>
          </Button>
        </div>

        <div className="mt-[var(--cb-space-24)] grid grid-cols-1 gap-x-[var(--cb-space-20)] gap-y-[var(--cb-space-18)] md:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <ServiceCard
                key={service.title}
                eyebrow={service.eyebrow}
                title={service.title}
                description={service.description}
                icon={
                  <Icon className="h-[var(--cb-size-20)] w-[var(--cb-size-20)]" />
                }
                imageSrc={service.imageSrc}
                ctaLabel={service.ctaLabel}
                ctaHref={service.ctaHref}
                className={cn(service.featured && "md:col-span-2")}
              />
            );
          })}
        </div>
      </LandingContainer>
    </section>
  );
}

export { LandingServices };
