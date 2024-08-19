"use client"

import Link from "next/link"
import { useState } from "react"
import { useModal } from "@/hooks/use-modal"

import { getBoards } from "@/app/api/kanban"
import { Button } from "@/Components/ui/button"
import H1 from "@/Components/shared/dashboard/H1"
import { IconAdd, IconKanban } from "@/public/assets/svgs"
import { kanban_Kanban } from "@/types/protectedroutes"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { useQuery, UseQueryResult } from "@tanstack/react-query"

const Kanban = () => {
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
    <div className="text-dark100_light900 mx-auto flex max-w-7xl flex-col gap-4 ">
      <div className="flex flex-row justify-between gap-4">
        <H1>Codevs Board</H1>
      </div>
      <div className="text-dark100_light900 flex max-w-7xl flex-col gap-4">
        <div className="text-dark100_light900 text-md font-semibold md:text-2xl">BOARDS</div>
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
            onClick={() => onOpen("boardAddModal", Boards)}
          >
            <IconAdd />
            <p>Add new board</p>
          </Button>
        </div>

        <Table>
          <TableHeader className="hidden lg:block">
            <TableRow className="grid grid-cols-4 place-items-center text-dark100_light900 border-none">
              <TableHead>Name</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Lead</TableHead>
              <TableHead>Board</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1">
            {Boards?.map((boards) => (
              <TableRow
                key={boards.id}
                className="flex flex-col lg:flex-none lg:grid lg:grid-cols-4 lg:place-items-center background-lightbox_darkbox text-dark100_light900 border-lightgray dark:border-black-500"
              >
                <TableCell>
                  <p>{boards.name || "Dummy Board" }</p>
                </TableCell>

                {boards.boardProjects.map((boardsproject) => (
                  <TableCell key={boardsproject.id}>
                    <p>{boardsproject.project?.project_name || "Dummy Project"}</p>
                  </TableCell>
                ))}

                {boards.boardProjects.map((boardsproject) => (
                  <TableCell key={boardsproject.id}>
                    <p>
                      {boardsproject.project?.team_leader.first_name || "John"} {boardsproject.project?.team_leader.last_name || "Doe"} 
                    </p>
                  </TableCell>
                ))}

                <TableCell className="lg:flex lg:justify-center lg:items-center">
                  <Link href={`/kanban/${boards.id}`}>
                    <Button variant="hollow" className="border-none lg:w-max">
                      <IconKanban className="invert dark:invert-0" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Kanban
