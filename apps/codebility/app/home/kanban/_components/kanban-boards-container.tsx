"use client"

import { useState } from "react"
import { useModal } from "@/hooks/use-modal"
import { Button } from "@/Components/ui/button"
import { IconAdd } from "@/public/assets/svgs"
import { kanban_Kanban } from "@/types/protectedroutes"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getBoards } from "@/app/api/kanban"

export default function KanbanBoardsContainer() {
  const [isSearching, setIsSearching] = useState("")
  const { onOpen } = useModal()

    const {
    data: Boards,
    isLoading: LoadingBoards,
    error: ErrorBoards,
  }: UseQueryResult<kanban_Kanban[], any> = useQuery({
    queryKey: ["Boards"],
    queryFn: async () => {
      return await getBoards()
    },
    refetchInterval: 3000,
  })

  if (LoadingBoards) return

  if (ErrorBoards) return

  return (
    <>
        <div className="flex flex-col items-end gap-4 md:flex-row md:items-center md:justify-end">
            <input
            type="text"
            value={isSearching}
            placeholder="Search board"
            onChange={(e) => setIsSearching(e.target.value)}
            className="h-10 w-full rounded-full border border-gray border-opacity-50 bg-inherit px-5 text-xs focus:outline-none md:w-80"
            />

            <Button
            variant="default"
            className="flex w-max items-center gap-2"
            onClick={() => onOpen("boardAddModal" ,Boards)}
            >
            <IconAdd />
            <p>Add new board</p>
            </Button>
        </div>
    </>
  )
}
