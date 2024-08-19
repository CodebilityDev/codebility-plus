"use client"

import { pageSize } from "@/constants"
import { useEffect, useState } from "react"

import ServiceCard from "@/app/(marketing)/services/components/ServiceCard"
import usePagination from "@/hooks/use-pagination"
import { servicesData, servicesTabs } from "@/app/(marketing)/services/components/data"
import { services_ServiceCardT } from "@/types/home"
import DefaultPagination from "@/Components/ui/pagination"
import Container from "@/app/(marketing)/Container"
import Section from "@/app/(marketing)/Section"

const ServicesTab = () => {
  const [services, setServices] = useState<services_ServiceCardT[]>([])
  const [projectType, setProjectType] = useState("Web Application")
  const [tabPages, setTabPages] = useState<{ [key: string]: number }>({
    "Web Application": 1,
    "Mobile Application": 1,
    "Product Design": 1,
  })

  const {
    paginatedData: paginatedServices,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(services, pageSize.services)

  useEffect(() => {
    const filteredData = servicesData.filter((service) => service.projectType === projectType)
    setServices(filteredData)
  }, [projectType])

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
                onClick={() => handleTabClick(tab.tabNumber, tab.tabName)}
                className={`cursor-pointer px-2 pb-2 text-base xl:text-xl ${
                  projectType === tab.tabName ? "border-b-2 border-violet text-violet" : "text-white"
                }`}
              >
                {tab.tabName}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {paginatedServices.map((service) => (
              <ServiceCard
                key={service.id}
                projectImage={service.projectImage}
                projectName={service.projectName}
                description={service.description}
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

export default ServicesTab
