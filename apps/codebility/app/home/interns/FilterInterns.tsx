import { Box } from "@/Components/shared/dashboard"
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@codevs/ui/checkbox"
import React, { useState } from "react"
import { positionTitles } from "@/app/home/interns/data"
import { interns_FilterInternsT } from "@/types/protectedroutes"

const FilterInterns = ({ filters, setFilters }: interns_FilterInternsT) => {
  const [showFilter, setShowFilter] = useState<boolean>(false)

  const updateFilter = (
    filterValue: interns_FilterInternsT["filters"][number],
    previousFilterValue: interns_FilterInternsT["filters"]
  ) => {
    if (previousFilterValue.includes(filterValue)) {
      const index = previousFilterValue.indexOf(filterValue)
      const isEmpty = index > -1

      if (isEmpty) {
        previousFilterValue.splice(index, 1)
      }
    } else {
      previousFilterValue.push(filterValue)
    }

    return [...previousFilterValue]
  }

  const selectFilter = (value: interns_FilterInternsT["filters"][number]) => {
    setFilters(updateFilter.bind(null, value))
  }
  const clearFilter = () => setFilters([])
  const toggleFilter = () => setShowFilter((prev) => !prev)

  return (
    <div className="relative text-gray">
      <Button variant={showFilter ? "destructive" : "default"} size="sm" onClick={toggleFilter}>
        {showFilter ? "Close filter" : "Filter"}
      </Button>
      <Box
        className={`absolute -right-3/4 top-12 z-[1] h-72 w-[250%] overflow-auto sm:-right-3/4 sm:w-72 md:right-0 md:w-64 lg:right-0 lg:w-64 ${
          !showFilter && "hidden"
        }`}
      >
        <div className="items mb-2 flex flex-row justify-between">
          <p className="pb-2 text-gray">Filter by</p>
          <p className="cursor-pointer text-sm" onClick={clearFilter}>
            Clear
          </p>
        </div>
        {positionTitles.map((position, index) => (
          <div className="flex cursor-pointer items-center justify-between gap-2 p-2 hover:bg-black-200" key={index}>
            <label htmlFor={position} className="cursor-pointer">
              {position}
            </label>
            <Checkbox
              id={position}
              checked={filters.includes(position)}
              onCheckedChange={selectFilter.bind(null, position)}
              className="border-violet data-[state=checked]:bg-violet"
            />
          </div>
        ))}
      </Box>
    </div>
  )
}

export default FilterInterns
