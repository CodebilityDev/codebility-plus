"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination/pagination";
import { usePaginatedQuery } from "@/hooks/query/use-paginated-query";
import { qk } from "@/lib/shared/query-keys";
import type { Page } from "@/lib/server/paginate";

import TaskCard, { TaskWithRelations } from "./TaskCard";
import { fetchTasksPageAction } from "@/actions/tasks/actions";

const PAGE_SIZE = 9;

// Flattens the nested kanban relation, which Supabase returns as either an
// object or a single-element array depending on how it resolves the join.
function normalize(task: any): TaskWithRelations {
  const column = Array.isArray(task.kanban_column) ? task.kanban_column[0] : task.kanban_column;
  if (!column) return { ...task, kanban_column: undefined };

  const board = Array.isArray(column.board) ? column.board[0] : column.board;
  if (!board) return { ...task, kanban_column: { ...column, board: undefined } };

  const project = Array.isArray(board.project) ? board.project[0] : board.project;
  return {
    ...task,
    kanban_column: { ...column, board: { ...board, project: project || undefined } },
  };
}

interface Props {
  initialData: Page<any>;
  codevId: string;
}

export default function TasksContainer({ initialData, codevId }: Props) {
  const [page, setPage] = useState(1);

  const { data, showSkeleton } = usePaginatedQuery<any>(
    qk.tasks.list({ codevId, page }),
    () => fetchTasksPageAction({ codevId, page, pageSize: PAGE_SIZE }),
    {
      initialData,
      initialDataKey: qk.tasks.list({ codevId, page: 1 }),
    },
  );

  const tasks = (data?.rows ?? []).map(normalize);
  const totalPages = Math.max(Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 1)), 1);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {showSkeleton ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800"
            />
          ))
        ) : tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <div>
            <h1 className="dark:text-white">No assigned task</h1>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="dark:text-white">
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  className="cursor-pointer"
                  onClick={() => setPage(index + 1)}
                  isActive={page === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
