"use client";

import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { Task } from "@/types/home/codev";

import TaskCard from "./TaskCard";

interface Props {
  tasks: Task[];
}

export default function TasksContainer({ tasks }: Props) {
  const PAGE_SIZE = 9;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    // Dynamically calculate the total number of pages
    const pages = Math.ceil((tasks?.length ?? 0) / PAGE_SIZE);
    setTotalPages(pages || 1);
  }, [tasks]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const paginatedTasks = tasks
    ? tasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : [];

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {paginatedTasks.length > 0 ? (
          paginatedTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div>
            <h1 className="dark:text-white">No assigned task</h1>
          </div>
        )}
      </div>

      {tasks && tasks.length > PAGE_SIZE && (
        <Pagination>
          <PaginationContent className="dark:text-white">
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={handlePreviousPage}
              />
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
              <PaginationNext
                className="cursor-pointer"
                onClick={handleNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
