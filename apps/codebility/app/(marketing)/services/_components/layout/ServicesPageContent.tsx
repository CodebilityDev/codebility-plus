"use client";

import { useServiceContext } from "../../_context";
import Calendly from "../../../_components/MarketingCalendly";
import Footer from "../../../_components/MarketingFooter";
import { ServicesHero, ServicesTab } from "../layout";
import { ServiceDetailModal } from "./ServiceDetailModal";

interface Props {
  servicesData: any[];
}

export const ServicesPageContent = ({ servicesData }: Props) => {
  const { activeService, clearActiveService, setActiveService } =
    useServiceContext();

  return (
    <>
      <ServicesHero />
      <ServicesTab
        servicesData={servicesData}
        onServiceSelect={setActiveService}
      />
      <Calendly />
      <Footer />
      
      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={activeService}
        isOpen={!!activeService}
        onClose={clearActiveService}
      />
    </>
  );
};
