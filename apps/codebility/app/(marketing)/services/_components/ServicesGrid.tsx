"use client";

import { useState } from "react";

import type { ServiceProject } from "./ServicesServiceCard";
import { ServiceDetailView } from "./ServiceDetailView";
import ServicesServiceCard from "./ServicesServiceCard";

export const ServicesGrid = ({ services }) => {
  const [activeService, setActiveService] = useState<ServiceProject | null>(
    null,
  );

  console.log("ServicesGrid - activeService:", activeService);

  if (activeService) {
    return (
      <ServiceDetailView
        service={activeService}
        onBack={() => setActiveService(null)}
      />
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
