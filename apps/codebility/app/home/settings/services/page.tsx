import Link from "next/link"
import { H1 } from "@/Components/shared/dashboard"
import { Button } from "@/Components/ui/button"
import { Table, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { IconAdd } from "@/public/assets/svgs"
import { getAllServices } from "@/app/home/settings/services/service"
import ServiceList from "./_components/service-list"
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb"

const headers = ["Name", "Category", "Description", "Edit", "Delete"]

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Services" },
]

const ServicesSetting = async () => {
  const data = await getAllServices();

  return (
    <div className="max-w-screen-xl mx-auto">
      <CustomBreadcrumb items={items} />
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <H1>Service Lists</H1>
          <div className="flex flex-col gap-4 md:flex-row">
            <Link href="/home/settings/services/categories">
              <Button variant="hollow" size="lg">
                Category Settings
              </Button>
            </Link>
            <Link href="/home/settings/services/add-new-service">
              <Button size="lg">
                <IconAdd className="mr-2" />
                Add New Service
              </Button>
            </Link>
          </div>
        </div>
    
        <Table className="text-dark100_light900 mt-8 w-full table-fixed overflow-auto">
          <TableHeader className="hidden background-lightbox_darkbox border-top text-xl lg:grid">
            <TableRow className="lg:grid lg:grid-cols-8">
              {headers.map((header) => (
                <TableHead key={header} className={`table-border-light_dark border-b-[1px] p-4 text-left text-xl font-light ${header === "Edit" || header === "Delete" ? "text-center" : "col-span-2"}`}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <ServiceList data={data} />
        </Table>
      </div>
    </div>
  )
}

export default ServicesSetting
