"use client";

import { useState } from "react"
import { Pagination, PaginationNext, PaginationPrevious } from "@/Components/ui/pagination/pagination"
import { PaginationContent, PaginationItem, PaginationLink } from "@/Components/ui/pagination/pagination"
import { Task } from "@/types/home/task";
import TaskCard from "./task-card";

interface Props {
    tasks: Task[];
}

export default function TasksContainer({ tasks }: Props) {
  const PAGE_SIZE = 9

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

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

  const paginatedTasks = tasks ? tasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE) : []

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedTasks.map((task: Task) => {
            return <TaskCard key={task.id} task={task} />
          })}
      </div>
      {tasks && tasks.length > PAGE_SIZE && (
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