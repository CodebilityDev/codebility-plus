import { Suspense } from "react";

import Container from "@/components/global/marketing/MarketingContainer";
import Section from "@/components/global/marketing/MarketingSection";

import { ServicesProjectsFallback } from "@/components/marketing/services/ServicesProjectsFallback";
import { ServicesProjectsSection } from "@/components/marketing/services/ServicesProjectsSection";
import type { ServicesPageProps } from "@/types/marketing/services/services";

export function ServicesProjectsBlock({ searchParams }: ServicesPageProps) {
  return (
    <Section id="services-projects" className="relative !pt-0">
      <Container className="relative z-0 !max-w-full px-4 sm:px-8 xl:min-w-[1260px] 2xl:min-w-[1560px]">
        <div className="flex flex-col gap-4">
          <Suspense fallback={<ServicesProjectsFallback />}>
            <ServicesProjectsSection searchParams={searchParams} />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}
