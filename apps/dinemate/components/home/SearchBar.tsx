'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import React, { useEffect, useState} from 'react';
import Image from 'next/image';


const SearchBar = ({initialSearch}: {initialSearch?:string}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get("category")
  const pathname = usePathname()
  const [search, setSearch] = useState(initialSearch ?? "")

  const handleSearch = () => {
    console.log("handle search")
    if (category) {      
      router.push(`${pathname}?category=${category}&search=${search}`)
    } else {
      router.push(`${pathname}?search=${search}`)
    }
  }
  
  const debouncedHandleSearch = debounce(handleSearch, 1000)    
  
  useEffect(() => {
    console.log("search effect")
    debouncedHandleSearch()
    return () => debouncedHandleSearch.cancel()
  }, [search])
    
  

  return (
    <div className="flex items-center border-[0.5px] border-gray-300  mt-[17px] rounded-[10px] pt-[0px] pr-[8px] pb-[0px] pl-[8px]  has-[:focus]:border-orange-400 bg-[#FFFFFF] ">
      <div className="flex-shrink-0 text-orange-500 ml-[8px]">

        <Image
          src={`/search-icon.svg`}
          alt="Picture of the food"
          width={30}
          height={0}
          className="aspect-[1.4] object-contain"
           />


      </div>
      <input
        type="text"
        placeholder="Discover Your Tastes"
        className="bg-transparent flex-grow focus:outline-none text-gray-700 ml-[16px] mt-[11px] mb-[11px] border-[#FF6969] mr-[8px] overflow-hidden"
        onChange={(e) => setSearch(e.currentTarget.value)}
        value={search}
      />
    </div>
  );
};

export default SearchBar;
