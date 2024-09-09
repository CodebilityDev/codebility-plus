import { H1 } from "@/Components/shared/dashboard";
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb";

import CategoriesAddNew from "./_components/categories-add-new";
import CategoriesTable from "./_components/categories-table";
import { Category } from "./_types/category";
import { getAllServiceCategories } from "./service";

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Services", href: "/home/settings/services" },
  { label: "Categories" },
];

const ServiceCategories = async () => {
  const categories = await getAllServiceCategories();

  return (
    <div className="mx-auto max-w-screen-xl">
      <CustomBreadcrumb items={items} />
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:justify-between">
          <H1>Service Categories</H1>
          <CategoriesAddNew />
        </div>
        <CategoriesTable categories={categories as Category[]} />
      </div>
    </div>
  );
};

export default ServiceCategories;
