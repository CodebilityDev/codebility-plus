"use client"

import { TableBody, TableCell, TableRow } from "@/Components/ui/table"
import { IconDelete, IconEditFillNone } from "@/public/assets/svgs"
import { deleteService } from "../action";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ServiceList = ({ data }: any) => {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        const formData = new FormData();
        formData.append("id", id);
    
        try {
            const response = await deleteService(formData);
            if (response?.success) {
                toast.success("Delete Service Successfully");
            } else {
                console.error("Failed to delete service:", response?.error);
            }
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    };

    return (
        <TableBody className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 lg:gap-0">
            {data.length > 0 ? (
                data.map((service: any) => (
                    <TableRow key={service.id} className="grid background-box lg:grid-cols-8">
                        <TableCell className="p-4 text-xl font-light lg:col-span-2">{service.name}</TableCell>
                        <TableCell className="p-4 text-xl font-light lg:col-span-2">{service.category}</TableCell>
                        <TableCell className="p-4 text-xl font-light truncate lg:col-span-2">{service.description}</TableCell>
                        <TableCell className="p-4 text-xl font-light">
                            <IconEditFillNone
                                onClick={() => router.push(`/home/settings/services/${service.id}`)}
                                className="lg:mx-auto cursor-pointer text-black dark:text-white duration-100 hover:scale-105" 
                            />
                        </TableCell>
                        <TableCell className="p-4 text-xl font-light">
                            <IconDelete 
                                onClick={() => handleDelete(service.id)} 
                                className="lg:mx-auto cursor-pointer text-blue-100 duration-100 hover:scale-105" 
                            />
                        </TableCell>
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="p-4 text-center text-gray-500 dark:text-gray-400">No data available</TableCell>
                </TableRow>
            )}
        </TableBody>
  )
}

export default ServiceList