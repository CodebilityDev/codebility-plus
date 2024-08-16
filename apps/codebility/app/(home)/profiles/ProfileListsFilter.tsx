import React, { useRef } from "react"
import { profiles_ListFilterT } from "@/types/home"
import { Button } from "@/Components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"

const ProfileListsFilter: React.FC<profiles_ListFilterT> = ({ selectedPosition, setSelectedPosition, users }) => {
  const selectGroupRef = useRef<HTMLDivElement>(null)

  const removedDuplicatePosition = users
    .map((user) => user?.main_position)
    .filter((pos, index, array) => {
      const posIndex = array.findIndex((p) => pos === p)
      return index === posIndex
    }) as string[]

  const removedNullPosition = removedDuplicatePosition.filter((pos) => pos !== null) as string[]

  const handleSelectPosition = () => {
    if (selectGroupRef.current) {
      selectGroupRef.current.style.display = "none"
      selectGroupRef.current.style.overflow = "hidden"
    }
    setSelectedPosition("")
  }
  return (
    <div className="mb-6 flex w-full flex-col items-center justify-between p-3">
      <div className="flex w-full max-w-80 flex-col ">
        <Select value={selectedPosition} onValueChange={setSelectedPosition}>
          <SelectTrigger
            aria-label="Position"
            className="text-md h-11 w-full rounded-full border-none bg-dark-100 px-5 text-white"
          >
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent ref={selectGroupRef} className="relative rounded-xl bg-dark-300 text-white">
            <SelectGroup className="mt-12">
              {removedNullPosition.map((position, i) => (
                <SelectItem key={i} value={position}>
                  {position}
                </SelectItem>
              ))}
              <div className="fixed left-0 right-0 top-0 flex w-full flex-row items-center justify-between border-b border-dark-200 px-3 py-2 bg-dark-300">
                <span>Filter by</span>
                <Button
                  className="w-auto bg-transparent hover:bg-transparent  "
                  variant="default"
                  size="sm"
                  onClick={handleSelectPosition}
                >
                  Clear
                </Button>
              </div>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default ProfileListsFilter
