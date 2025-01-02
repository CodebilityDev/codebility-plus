import { HTMLAttributes } from "react"
import CategoryPill from "./CategoryPill"
import "./pillScrollbarStyle.css"
import { cn } from "@codevs/ui"
import { categories } from "~/lib/categories"

interface ICategories extends HTMLAttributes<HTMLElement> {}


export default function Categories({ className, ...props }:ICategories) {
  return (
    <section className={cn("w-full flex flex-col gap-y-3 mt-3", className)} {...props}>
      <div id="pills-container" className="py-6 w-full flex flex-row gap-x-2 overflow-x-auto">
        {
          categories.map((c) => (
            <CategoryPill key={c.value} {...c}  />
          ))
        }
      </div>
    </section>
  )
}