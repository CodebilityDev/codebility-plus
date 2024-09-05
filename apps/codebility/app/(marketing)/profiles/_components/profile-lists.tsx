"use client";

import { useEffect, useState } from "react"
import { pageSize } from "@/constants"
import ProfileCard from "./profile-card"
import usePagination from "@/hooks/use-pagination"
import getRandomColor from "@/lib/getRandomColor"
import DefaultPagination from "@/Components/ui/pagination"
import ProfileListsFilter from "./profile-lists-filter"
import { Codev } from "@/types/home/codev";

interface Props {
  codevs: Codev[];
}

export default function ProfileLists({ codevs }: Props) {
  const [toPaginateUser, setToPaginateUser] = useState<Codev[]>([])
  const [selectedPosition, setSelectedPosition] = useState<string>("")

  const {
    paginatedData: paginatedUsers,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
    setCurrentPage,
  } = usePagination(toPaginateUser, pageSize.codevsList)

  useEffect(() => {
    const filteredPosition = () => {
      if (!selectedPosition) {
        setToPaginateUser(codevs)
        return
      }
      const filteredUser = codevs.filter((pos) => pos?.main_position == selectedPosition)
      setToPaginateUser(filteredUser)
    }
    filteredPosition()
  }, [selectedPosition, codevs])

  if (codevs.length === 0) {
    return <p className="text-center text-2xl text-gray">Sorry, no data found.</p>
  }

  return (
    <div className="m-auto h-full w-full max-w-6xl">
      <ProfileListsFilter selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition} users={codevs} />
      <div
        className={`grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
          paginatedUsers.length < 5 ? "xl:grid-cols-4" : "xl:grid-cols-5"
        }`}
      >
        {paginatedUsers.map((user) => (
          <ProfileCard color={getRandomColor() || ""} key={user.id} codev={user} />
        ))}
      </div>
      <div className="text-white">
        {codevs.length > pageSize.codevsList && (
          <DefaultPagination
            currentPage={currentPage}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  )
}
