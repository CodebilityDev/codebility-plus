"use client";

import { useServiceContext } from "../../_context";
import Calendly from "../../../_components/MarketingCalendly";
import Footer from "../../../_components/MarketingFooter";
import { ServicesHero, ServicesTab } from "../layout";
import { ServiceDetailView } from "./ServiceDetailView";

interface Props {
  servicesData: any[];
}

export const ServicesPageContent = ({ servicesData }: Props) => {
  const { activeService, clearActiveService, setActiveService } =
    useServiceContext();

  // If a service is selected, show only the detail view
  if (activeService) {
    return (
      <ServiceDetailView service={activeService} onBack={clearActiveService} />
    );
  }

  // Otherwise, show the normal services page
  return (
    <>
      <ServicesHero />
      <ServicesTab
        servicesData={servicesData}
        onServiceSelect={setActiveService}
      />
      <Calendly />
      <Footer />
    </>
  );
};
