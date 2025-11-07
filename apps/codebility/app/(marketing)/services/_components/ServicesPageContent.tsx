"use client";

import { useState } from "react";

import type { ServiceProject } from "./ServicesServiceCard";
import Calendly from "../../_components/MarketingCalendly";
import Footer from "../../_components/MarketingFooter";
import { ServiceDetailView } from "./ServiceDetailView";
import Hero from "./ServicesHero";
import ServicesTab from "./ServicesTab";

interface Props {
  servicesData: any[];
}

export function ServicesPageContent({ servicesData }: Props) {
  const [activeService, setActiveService] = useState<ServiceProject | null>(
    null,
  );

  // If a service is selected, show only the detail view
  if (activeService) {
    return (
      <ServiceDetailView
        service={activeService}
        onBack={() => setActiveService(null)}
      />
    );
  }

  // Otherwise, show the normal services page
  return (
    <>
      <Hero />
      <ServicesTab
        servicesData={servicesData}
        onServiceSelect={(service) => setActiveService(service)}
      />
      <Calendly />
      <Footer />
    </>
  );
}
