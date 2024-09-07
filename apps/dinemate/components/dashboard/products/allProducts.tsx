"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { usePathname, useRouter } from "next/navigation"
import { categories } from "@/util/categories"


export default function AllProducts(){
    const router = useRouter()
    const pathname = usePathname()

    function handeCategory(v:string){

        const param = new URLSearchParams()
        if (v !== "all") {
            param.append('category',v);      
        } else {
            param.delete("category")
        }
        router.replace(`${pathname}?${param.toString()}`);
    }
    
    return(
        <>
            <Select onValueChange={handeCategory}>
                    <SelectTrigger className="w-[180px] h-[44px] border bg-white border-[#CDCAC8] text-lg ms-3 rounded-lg">
                    <SelectValue placeholder="Categories" />
                    </SelectTrigger>
                    <SelectContent>
                    {
                        categories.map(c => (
                        <SelectItem key={c.value} value={c.value}>
                            {c.label}
                        </SelectItem>
                        ))
                    }
                    </SelectContent>
                </Select>


                
        </>
    )
      
}

    
