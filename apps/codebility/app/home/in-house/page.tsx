"use client"
import * as React from "react"
import H1 from "@/Components/shared/dashboard/H1"
import Table from "@/app/home/in-house/Table"
import InHouseCards from "@/app/home/in-house/InHouseCards"
import axios from "axios"
import { TeamMemberT } from "@/types/index"
import { useQuery } from "@tanstack/react-query"
import { API } from "@/lib/constants"
import { useEffect, useState } from "react"
import usePagination from "@/hooks/use-pagination"

function InHouse() {
  const [editableIds, setEditableIds] = useState<number[]>([])

  const {
    data: inHouse,
    isLoading: LoadinginHouse,
    error: ErrorinHouse,
    isSuccess,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get(`${API.USERS}/inHouse`)
      return response.data.data
    },
    refetchInterval: 3000,
  })

  const [data, setData] = useState<TeamMemberT[]>([])

  useEffect(() => {
    if (isSuccess) {
      setData(inHouse)
    }
  }, [isSuccess, inHouse])

  const handleEditButton = (id: number) => {
    setEditableIds((prevIndexes) => [...prevIndexes, id])
  }

  const handleSaveButton = (updatedMember: TeamMemberT) => {
    const updatedData = data.map((member) => (member.id === updatedMember.id ? updatedMember : member))
    setData(updatedData)
    setEditableIds((prevIndexes) => prevIndexes.filter((editableId) => editableId !== updatedMember.id))
  }

  // Update BE
  // const {update} = useMutation({
  //   mutationFn: (id) => {
  //     return axios.patch(`API.PROJECTS/${id}`, {status:resolved})
  //   },
  // })

  const { currentPage, totalPages, paginatedData, handlePreviousPage, handleNextPage } = usePagination(data, 10)

  return (
    <div className="flex flex-col gap-2">
      <H1>In-House Codebility</H1>
      <Table
        data={paginatedData}
        editableIds={editableIds}
        handlers={{
          setData,
          handleEditButton,
          handleSaveButton,
        }}
        status={{
          LoadinginHouse,
          ErrorinHouse,
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
      <InHouseCards
        data={paginatedData}
        editableIds={editableIds}
        handlers={{
          setData,
          handleEditButton,
          handleSaveButton,
        }}
        status={{
          LoadinginHouse,
          ErrorinHouse,
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  )
}

export default InHouse
