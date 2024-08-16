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
import { IconDelete, IconEdit } from "@/public/assets/svgs"

const services = [
  {
    name: "Web Application",
  },
  {
    name: "Mobile Application",
  },
  {
    name: "Product Design",
  },
]

const ServiceCategories = () => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/services">Services</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Categories</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-row justify-between gap-4">
          <H1>Service Categories</H1>
          <div className="flex gap-4">
            <Button variant="default" size="lg" className="w-[200px]">
              Add New Category
            </Button>
          </div>
        </div>
        <Table className="background-box text-dark100_light900 mt-8 w-full  table-fixed overflow-auto">
          <TableHeader className="background-lightbox_darkbox border-top text-xl">
            <TableRow>
              <TableHead className="table-border-light_dark w-full border-b-[1px] p-4 text-left text-xl font-light">
                Name
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
              <TableRow key={index} className={`odd:bg-gray-100 even:bg-[#444857]`}>
                <TableCell className="p-4 text-xl font-light">{service.name}</TableCell>
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

export default ServiceCategories
