"use client"

import React, { useEffect, useState } from "react"

const PAGE_SIZE = 9
import { TaskT } from "@/types"
import Loading from "@/app/home/tasks/loading"
import TaskCard from "@/app/home/tasks/TaskCard"
import { getTasks } from "@/app/api/kanban"
import useAuth from "@/hooks/use-auth"
import H1 from "@/Components/shared/dashboard/H1"
import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { Pagination, PaginationNext, PaginationPrevious } from "@/Components/ui/pagination/pagination"
import { PaginationContent, PaginationItem, PaginationLink } from "@/Components/ui/pagination/pagination"

const TaskPage = () => {
  const { userData } = useAuth()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    setUserId(userData?.id)
  }, [userData?.id])

  const {
    data: Tasks,
    isLoading: LoadingTasks,
    error: ErrorTasks,
  }: UseQueryResult<TaskT[], any> = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await getTasks()
      const tasks = response.filter((task: TaskT) => task.userTask.some((userTask) => userTask.id === userId))
      setTotalPages(Math.ceil(tasks.length / PAGE_SIZE))
      return tasks
    },
    refetchInterval: 3000,
  })

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const paginatedTasks = Tasks ? Tasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) : []

  if (LoadingTasks) return <Loading />

  if (ErrorTasks) return

  return (
    <div className="flex min-h-[70vh] flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <H1>My Tasks</H1>
      </div>
      {Tasks && Tasks.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedTasks.map((task: TaskT) => {
            return <TaskCard key={task.id} task={task} />
          })}
        </div>
      )}
      {Tasks && Tasks.length > PAGE_SIZE && (
        <Pagination>
          <PaginationContent className="dark:text-white">
            <PaginationItem>
              <PaginationPrevious className="cursor-pointer" onClick={handlePreviousPage} />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext className="cursor-pointer" onClick={handleNextPage} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default TaskPage
