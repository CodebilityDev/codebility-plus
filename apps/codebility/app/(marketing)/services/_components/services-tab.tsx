"use client"

import { pageSize } from "@/constants"
import { useEffect, useState } from "react"
import ServiceCard from "./services-service-card"
import usePagination from "@/hooks/use-pagination"
import DefaultPagination from "@/Components/ui/pagination"
import Container from "../../_components/marketing-container"
import Section from "../../_components/marketing-section"
import { Service } from "../_types/service"
import { removeArrayDuplicate } from "../../_lib/util"

interface Props {
  servicesData: Service[];
}

export default function ServicesTab({ servicesData }: Props) {
  const [services, setServices] = useState<Service[]>(servicesData)
  const [projectType, setProjectType] = useState("Web Application")

  const [tabPages, setTabPages] = useState<{ [key: string]: number }>({
    "Web Application": 1,
    "Mobile Application": 1,
    "Product Design": 1,
  });

  // get all the categories and removed duplicates
  const servicesCategory = removeArrayDuplicate(
    servicesData.map(service => service.category)
  );

  // make categories as tab
  const servicesTabs = servicesCategory.map((category,id)=> {
    return {
      id,
      name: category,
      number: id + 1
    }
  });

  const {
    paginatedData: paginatedServices,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(services, pageSize.services)

 /*  useEffect(() => {
    const filteredData = servicesData.filter((service) => service.projectType === projectType)
    setServices(filteredData)
  }, [projectType]) */

  useEffect(() => {
    setCurrentPage(tabPages[projectType] || 1)
  }, [projectType, tabPages, setCurrentPage])

  const handleTabClick = (tabNumber: number, tabName: string) => {
    setTabPages((prev) => ({
      ...prev,
      [projectType]: currentPage,
    }))

    setProjectType(tabName)
  }

  return (
    <Section className="relative">
      <Container className="relative z-10">
        <div className="flex flex-col gap-10  ">
          <div className="mx-auto flex flex-wrap justify-center gap-5 xl:gap-16">
            {servicesTabs.map((tab) => (
              <p
                key={tab.id}
                onClick={() => handleTabClick(tab.number, tab.name)}
                className={`cursor-pointer px-2 pb-2 text-base xl:text-xl ${
                  projectType === tab.name ? "border-b-2 border-violet text-violet" : "text-white"
                }`}
              >
                {tab.name}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {paginatedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
          <div className="text-white">
            {services.length > pageSize.services && (
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
  )
}