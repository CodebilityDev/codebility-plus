
"use client";

import Image from "next/image"
import { useSearchParams ,usePathname, useRouter} from 'next/navigation'
import { useState, useEffect } from "react";
import { debounce } from "lodash";



export default function SearchBar({
  initialSearch
}: {
  initialSearch?: string
}){

  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [search, setSearch] = useState(initialSearch ?? "")


  const { replace } = useRouter();

function handleSearch(){


  const param = new URLSearchParams(searchParams)

  if(search){
      param.set('search',search);

  }else{

      param.delete('search');

  }

  replace(`${pathName}?${param.toString()}`);

}

const debouncedHandleSearch = debounce(handleSearch, 1000)

useEffect(() => {
  console.log("search effect")
  debouncedHandleSearch()
  return () => debouncedHandleSearch.cancel()
}, [search])


    return (<>


   

    <div className="flex flex-col rounded-[0.625em] border-2 bg-white border-[#CDCAC8]">


<div className="flex item-center justify-between ">


<div className="flex flex-col  ">

<div className="flex items-center justify-center ml-[0.625em] my-[0.625em]">

        <Image src={`/dashboardSearch-icon.svg`}
        alt="search"
        width={24}
        height={0}
        className=" aspect-[1] object-contain min-w-[1.5em]"
        ></Image>


      </div>

</div>



<div className="flex flex-col">

<div className="flex items-center justify-center">

<input type="text" placeholder="Search" className="w-full ml-[0.75em]  my-[0.625em] bg-transparent focus:outline-none text-[1rem] font-normal" 
 onChange={(e) => {
  setSearch(e.currentTarget.value)
}}
defaultValue={searchParams.get('query')?.toString()}
/>

</div>


</div>



</div>



       

     

    </div>
    
    
    </>)
}