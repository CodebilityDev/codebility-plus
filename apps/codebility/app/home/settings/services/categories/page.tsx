import { H1 } from "@/Components/shared/dashboard"
import CustomBreadcrumb from "@/Components/shared/dashboard/CustomBreadcrumb"
import CategoriesAddNew from "./_components/categories-add-new"
import CategoriesTable from "./_components/categories-table"
import { getAllServiceCategories } from "./service"
import { Category } from "./_types/category"

const items = [
  { label: "Settings", href: "/home/settings" },
  { label: "Services", href: "/home/settings/services" },
  { label: "Categories" }
]

const ServiceCategories = async () => {
  const categories = await getAllServiceCategories();

  return (
    <div className="max-w-screen-xl mx-auto">
      <CustomBreadcrumb items={items} />
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:justify-between md:items-center">
          <H1>Service Categories</H1>
          <CategoriesAddNew />
        </div>
        <CategoriesTable categories={categories as Category[]} />
      </div>
    </div>
  )
}

export default ServiceCategories
