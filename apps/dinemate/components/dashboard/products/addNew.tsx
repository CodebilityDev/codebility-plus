"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"


export default function AddNew(){
    const router = useRouter()

    return(        
        <div 
        role="button" 
        tabIndex={0} 
        className="flex flex-col rounded-[0.625em] border bg-white border-1 border-[#CDCAC8] max-w-[9.8125] ml-[0.75em]"
        onClick={() => {
            router.push("/dashboard/products/new")
        }}

        >


            <div className="flex items-center justify-between ">

             
             <div className="flex flex-col  ">

                <div className="flex items-center  my-[0.625em] mx-[1rem]">

                    <p className=" text-[1rem] font-normal whitespace-nowrap">Add New</p>


                </div>


             </div>


             <div className="flex flex-col   ">

                <div className="flex items-center mr-[1rem]  ">

                <Image src={`/dashboardPlus-icon.svg`}
                 alt="search"
                 width={24}
                 height={0}
                 className="aspect-[1] object-contain min-w-[1.5em] cursor-pointer"
                 ></Image>
                    
                </div>


             </div>



            </div>


        </div>

        
        
    )
}