"use client";

import { ServicesServiceCard, type ServiceProject } from "../ui";

interface Props {
  services: ServiceProject[];
  onSelect?: (service: ServiceProject) => void;
}

export const ServicesGrid = ({ services, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {services.map((service) => (
        <ServicesServiceCard
          key={service.id}
          service={service}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
