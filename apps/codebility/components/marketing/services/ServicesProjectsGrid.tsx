"use client";

import { servicesProjectsGridClass } from "@/components/marketing/services/ServicesGridSkeleton";
import { ServicesServiceCard } from "@/components/marketing/services/ServicesServiceCard";
import type { ServiceProject } from "@/types/marketing/services/services";

export function ServicesProjectsGrid({
  projects,
  page,
  onServiceSelect,
}: {
  projects: ServiceProject[];
  page: number;
  onServiceSelect?: (service: ServiceProject) => void;
}) {
  if (projects.length === 0) {
    return (
      <div className="py-20 text-center text-white">
        No projects available for this category
      </div>
    );
  }

  return (
    <div key={page} className={servicesProjectsGridClass}>
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="animate-fade-in-up aspect-square w-full"
          style={{
            animationDelay: `${index * 80}ms`,
            animationFillMode: "both",
          }}
        >
          <ServicesServiceCard service={project} onSelect={onServiceSelect} />
        </div>
      ))}
    </div>
  );
}
