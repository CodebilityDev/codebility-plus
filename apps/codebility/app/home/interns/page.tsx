"use client"

import FilterInterns from "@/app/home/interns/FilterInterns"
import InternList from "@/app/home/interns/InternList"
import H1 from "@/Components/shared/dashboard/H1"
import { positionTitles } from "@/app/home/interns/data"
import { useState } from "react"

const Interns = () => {
  const [filters, setFilters] = useState<Partial<typeof positionTitles[number]>[]>([])

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <H1>Interns</H1>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex justify-center md:justify-end">
            <FilterInterns filters={filters} setFilters={setFilters}/>
          </div>
        </div>
      </div>
      <InternList filters={filters}/>
    </div>
  )
}

export default Interns
