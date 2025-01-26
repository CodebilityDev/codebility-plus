"use client";

import { useEffect, useState } from "react";
import DefaultPagination from "@/Components/ui/pagination";
import { pageSize } from "@/constants";
import usePagination from "@/hooks/use-pagination";
import { Project } from "@/types/home/codev";

import Container from "../../_components/marketing-container";
import Section from "../../_components/marketing-section";
import ServiceCard from "./services-service-card";

// Predefined categories
const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
];

interface Props {
  servicesData: Project[];
}

export default function ServicesTab({ servicesData }: Props) {
  const [projects, setProjects] = useState<Project[]>(servicesData);
  const [category, setCategory] = useState(PROJECT_CATEGORIES[0]);

  // Initialize pagination for each category
  const initialTabPages: Record<string, number> = {};
  PROJECT_CATEGORIES.forEach((category) => {
    initialTabPages[category] = 1;
  });

  const [tabPages, setTabPages] = useState(initialTabPages);

  // Create tabs from predefined categories
  const projectTabs = PROJECT_CATEGORIES.map((category, id) => ({
    id,
    name: category,
    number: id + 1,
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
      // You might need to adjust this filtering based on your project_category relationship
      return true; // For now, show all projects
    });
    setProjects(filteredData);
  }, [category, servicesData]);

  useEffect(() => {
    setCurrentPage(tabPages[category] || 1);
  }, [category, tabPages, setCurrentPage]);

  const handleTabClick = (tabNumber: number, tabName: string) => {
    setTabPages((prev) => ({
      ...prev,
      [category]: currentPage,
    }));

    setCategory(tabName);
  };

  return (
    <Section className="relative">
      <Container className="relative z-10">
        <div className="flex flex-col gap-10">
          <div className="mx-auto flex flex-wrap justify-center gap-5 xl:gap-16">
            {projectTabs.map((tab) => (
              <p
                key={tab.id}
                onClick={() => handleTabClick(tab.number, tab.name)}
                className={`cursor-pointer px-2 pb-2 text-base xl:text-xl ${
                  category === tab.name
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
                    category: category, // Using selected category
                    mainImage: project.website_url || "",
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
