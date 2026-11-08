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
      className="border-t border-white/10 py-24 lg:py-32"
    >
      <LandingContainer>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-3">
            <Eyebrow variant="outline">WHAT WE BUILD</Eyebrow>
            <h2 className="max-w-[720px] text-[32px] font-bold leading-9 tracking-tight text-[#f4f4f4] md:text-[44px] md:leading-[48px]">
              Strategy, design and engineering
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                under one roof
              </span>
            </h2>
          </div>

          <Button asChild variant="outline" className="w-fit">
            <Link href="/services">
              All services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <ServiceCard
                key={service.title}
                eyebrow={service.eyebrow}
                title={service.title}
                description={service.description}
                icon={<Icon className="h-[18px] w-[18px]" />}
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
