"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { useModal } from "@/hooks/use-modal-service-categories"
import { IconDelete, IconEditFillNone } from "@/public/assets/svgs"
import { Category } from "../_types/category"

const headers = ["Name", "Edit", "Delete"]

const CategoriesTable = ({ categories }: { categories: Category[] }) => {
    const { onOpen } = useModal();
    
    return (
        <Table className="text-dark100_light900 mt-8 w-full table-fixed overflow-auto">
            <TableHeader className="hidden background-lightbox_darkbox border-top text-xl lg:grid">
                <TableRow className="lg:grid lg:grid-cols-5 xl:grid-cols-6">
                    {headers.map((header) => (
                        <TableHead key={header} className={`table-border-light_dark w-full border-b-[1px] p-4 text-left text-xl font-light ${header === "Name" ? "lg:col-span-3 xl:col-span-4" : "lg:text-center"}`}>
                           {header}
                       </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 lg:gap-0">
                {categories.length > 0 ? categories.map((category) => (
                    <TableRow key={category.id} className="grid background-box lg:grid-cols-5 xl:grid-cols-6">
                        <TableCell className="p-4 text-xl font-light lg:col-span-3 xl:col-span-4">{category.name}</TableCell>
                        <TableCell className="p-4 text-xl font-light">
                            <IconEditFillNone 
                                onClick={() => onOpen("serviceCategoriesModal", category)}
                                className="cursor-pointer duration-100 hover:scale-105 lg:mx-auto" 
                            />
                        </TableCell>
                        <TableCell className="p-4 text-xl font-light">
                            <IconDelete
                                onClick={() => onOpen("serviceCategoriesDeleteModal", category)}
                                className="cursor-pointer text-blue-100 duration-100 hover:scale-105 lg:mx-auto" 
                            />
                        </TableCell>
                    </TableRow>
                )) :  
                <TableRow>
                    <TableCell className="p-4 text-center text-gray-500 dark:text-gray-400">No data available</TableCell>
                </TableRow>}
            </TableBody>
        </Table>
  )
}

export default CategoriesTable