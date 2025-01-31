"use client";

import { useEffect, useState } from "react";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Project } from "@/types/home/codev";

import Container from "../../_components/marketing-container";
import Section from "../../_components/marketing-section";
import ServiceCard from "./services-service-card";

interface Props {
  servicesData: Project[];
}

export default function ServicesTab({ servicesData }: Props) {
  const [projects, setProjects] = useState<Project[]>(servicesData);
  const [category, setCategory] = useState<number>(0); // Use `project_category_id`

  // Initialize pagination for each category
  const initialTabPages: Record<number, number> = {};
  servicesData.forEach((project) => {
    if (project.project_category_id !== undefined) {
      initialTabPages[project.project_category_id] = 1;
    }
  });

  const [tabPages, setTabPages] =
    useState<Record<number, number>>(initialTabPages);

  const uniqueCategories = Array.from(
    new Set(servicesData.map((project) => project.project_category_id)),
  );

  const projectTabs = uniqueCategories.map((categoryId, id) => ({
    id,
    name: `Category ${categoryId}`,
    number: categoryId || 0,
  }));

  const {
    paginatedData: paginatedProjects,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(projects, pageSize.services);

  useEffect(() => {
    const filteredData = servicesData.filter((project) => {
      return project.project_category_id === category;
    });
    setProjects(filteredData);
  }, [category, servicesData]);

  useEffect(() => {
    setCurrentPage(tabPages[category] || 1);
  }, [category, tabPages, setCurrentPage]);

  const handleTabClick = (tabNumber: number) => {
    setTabPages((prev) => ({
      ...prev,
      [category]: currentPage,
    }));

    setCategory(tabNumber);
  };

  return (
    <Section className="relative">
      <Container className="relative z-10">
        <div className="flex flex-col gap-10">
          <div className="mx-auto flex flex-wrap justify-center gap-5 xl:gap-16">
            {projectTabs.map((tab) => (
              <p
                key={tab.id}
                onClick={() => handleTabClick(tab.number)}
                className={`cursor-pointer px-2 pb-2 text-base xl:text-xl ${
                  category === tab.number
                    ? "border-violet text-violet border-b-2"
                    : "text-white"
                }`}
              >
                {tab.name}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((project) => (
                <ServiceCard
                  key={project.id}
                  service={{
                    id: project.id,
                    name: project.name,
                    description: project.description || "",
                    main_image: project.main_image || "",
                    github_link: project.github_link,
                    figma_link: project.figma_link,
                    start_date: project.start_date,
                    end_date: project.end_date,
                  }}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-white">
                No projects available for this category
              </div>
            )}
          </div>

          <div className="text-white">
            {projects.length > pageSize.services && (
              <DefaultPagination
                currentPage={currentPage}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
