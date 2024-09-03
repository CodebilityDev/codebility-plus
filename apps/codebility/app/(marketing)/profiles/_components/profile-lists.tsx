import { useEffect, useState } from "react"

import { User } from "@/types"
import { pageSize } from "@/constants"
import ProfileCard from "@/app/(marketing)/profiles/_components/profile-card"
import usePagination from "@/hooks/use-pagination"
import getRandomColor from "@/lib/getRandomColor"
import DefaultPagination from "@/Components/ui/pagination"
import { getAllCodevs } from "@/app/api"
import ProfileListsFilter from "@/app/(marketing)/profiles/_components/profile-lists-filter"

const ProfileLists = () => {
  const [users, setUsers] = useState<User[]>([])
  const [toPaginateUser, setToPaginateUser] = useState<User[]>([])
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
    const fetchData = async () => {
      const userData = await getAllCodevs()
      setUsers(userData)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const filteredPosition = () => {
      if (!selectedPosition) {
        setToPaginateUser(users)
        return
      }
      const filteredUser = users.filter((pos) => pos?.main_position == selectedPosition)
      setToPaginateUser(filteredUser)
    }
    filteredPosition()
  }, [selectedPosition, users])

  if (users.length === 0) {
    return <p className="text-center text-2xl text-gray">Sorry, no data found.</p>
  }

  return (
    <div className="m-auto h-full w-full max-w-6xl">
      <ProfileListsFilter selectedPosition={selectedPosition} setSelectedPosition={setSelectedPosition} users={users} />
      <div
        className={`grid h-full w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${
          paginatedUsers.length < 5 ? "xl:grid-cols-4" : "xl:grid-cols-5"
        }`}
      >
        {paginatedUsers.map((user) => (
          <ProfileCard color={getRandomColor() || ""} key={user.id} user={user} />
        ))}
      </div>
      <div className="text-white">
        {users.length > pageSize.codevsList && (
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

export default ProfileLists
