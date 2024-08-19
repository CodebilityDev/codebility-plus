"use client"
import { H1 } from "@/Components/shared/dashboard"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@codevs/ui/breadcrumb"

import { Button } from "@/Components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { IconAdd, IconDelete, IconEdit } from "@/public/assets/svgs"
import Link from "next/link"

const services = [
  {
    name: "E-Commerce Website",
    category: "Web Application",
    description: "Lorem Ipsum Kirem",
  },
  {
    name: "Finance & Banking App",
    category: "Mobile Application",
    description: "Lorem Ipsum Kirem",
  },
  {
    name: "Business Website",
    category: "Web Application",
    description: "Lorem Ipsum Kirem",
  },
  {
    name: "Social Media Platform",
    category: "Web Application",
    description: "Connecting people worldwide",
  },
  {
    name: "Fitness Tracking App",
    category: "Mobile Application",
    description: "Track your fitness goals",
  },
  {
    name: "Project Management Tool",
    category: "Web Application",
    description: "Manage your projects efficiently",
  },
]

const ServicesSetting = () => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Services</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-row justify-between gap-4">
          <H1>Service Lists</H1>
          <div className="flex gap-4">
            <Link href="/settings/services/categories">
              <Button variant="hollow" size="lg">
                Category Settings
              </Button>
            </Link>
            <Link href="/settings/services/add-new-service">
              <Button variant="default" size="lg" className="w-[200px]">
                <IconAdd className="mr-2" />
                Add New Service
              </Button>
            </Link>
          </div>
        </div>
        <Table className="background-box text-dark100_light900 mt-8 w-full min-w-[850px] table-fixed overflow-auto">
          <TableHeader className="background-lightbox_darkbox border-top text-xl">
            <TableRow>
              <TableHead className="table-border-light_dark border-b-[1px] p-4 text-left text-xl font-light">
                Name
              </TableHead>
              <TableHead className="table-border-light_dark border-b-[1px] p-4 text-left text-xl font-light">
                Category
              </TableHead>
              <TableHead className="table-border-light_dark border-b-[1px] p-4 text-left text-xl font-light">
                Description
              </TableHead>
              <TableHead className="table-border-light_dark w-20 border-b-[1px] p-4 text-left text-xl font-light">
                Edit
              </TableHead>
              <TableHead className="table-border-light_dark w-36 border-b-[1px] p-4 text-left text-xl font-light">
                Delete
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <TableRow key={index}>
                <TableCell className="p-4 text-xl font-light">{service.name}</TableCell>
                <TableCell className="p-4 text-xl font-light">{service.category}</TableCell>
                <TableCell className="p-4 text-xl font-light">{service.description}</TableCell>
                <TableCell className="p-4 text-xl font-light">
                  <IconEdit className="mx-auto cursor-pointer duration-100 hover:scale-105" />
                </TableCell>
                <TableCell className="p-4 text-xl font-light">
                  <IconDelete className="ms-4 cursor-pointer text-blue-100 duration-100 hover:scale-105" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default ServicesSetting
