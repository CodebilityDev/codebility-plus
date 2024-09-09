import Link from "next/link";
import { getAllServices } from "@/app/home/settings/services/service";
import { H1 } from "@/Components/shared/dashboard";
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb";
import { Button } from "@/Components/ui/button";
import { Table, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { IconAdd } from "@/public/assets/svgs";

import ServiceList from "./_components/service-list";

const headers = ["Name", "Category", "Description", "Edit", "Delete"];

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Services" },
];

const ServicesSetting = async () => {
  const data = await getAllServices();

  return (
    <div className="mx-auto max-w-screen-xl">
      <CustomBreadcrumb items={items} />
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
          <TableHeader className="background-lightbox_darkbox border-top hidden text-xl lg:grid">
            <TableRow className="lg:grid lg:grid-cols-8">
              {headers.map((header) => (
                <TableHead
                  key={header}
                  className={`table-border-light_dark border-b-[1px] p-4 text-left text-xl font-light ${header === "Edit" || header === "Delete" ? "text-center" : "col-span-2"}`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <ServiceList data={data} />
        </Table>
      </div>
    </div>
  );
};

export default ServicesSetting;
