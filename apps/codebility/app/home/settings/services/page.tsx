import Link from "next/link";
import { getAllServices } from "@/app/home/settings/services/service";
import { H1 } from "@/Components/shared/dashboard";
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb";
import { Button } from "@/Components/ui/button";
import { IconAdd } from "@/public/assets/svgs";
import ServiceTable from "./_components/service-table";


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

        <ServiceTable data={data} />
      </div>
    </div>
  );
};

export default ServicesSetting;
