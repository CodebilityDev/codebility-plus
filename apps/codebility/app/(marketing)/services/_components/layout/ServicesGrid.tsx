"use client";

import { useServiceContext } from "../../_context";
import { ServicesServiceCard } from "../ui";

export const ServicesGrid = ({ services }) => {
  const { activeService, setActiveService, clearActiveService } =
    useServiceContext();

  if (activeService) {
    const { ServiceDetailView } = require("./ServiceDetailView");
    return (
      <ServiceDetailView service={activeService} onBack={clearActiveService} />
    );
  }

  return (
    <div>
      {services.map((service) => (
        <ServicesServiceCard
          key={service.id}
          service={service}
          onSelect={(s) => setActiveService(s)}
        />
      ))}
    </div>
  );
};
