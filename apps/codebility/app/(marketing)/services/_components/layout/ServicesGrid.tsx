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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
