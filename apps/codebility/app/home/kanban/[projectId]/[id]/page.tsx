"use client";

import { useEffect, useMemo, useState } from "react";
import { useKanbanStore } from "@/store/kanban-store";
import { KanbanBoardType, KanbanColumnType, Task } from "@/types/home/codev";

import KanbanBoard from "./_components/KanbanBoard";
import KanbanLoadingSkeleton from "./loading";

interface KanbanBoardPageProps {
  params: { id: string; projectId: string };
  searchParams?: { query?: string };
}

// Mapping functions to convert raw data into our expected types.
const mapTask = (task: any): Task => ({
  id: String(task.id),
  title: task.title,
  description: task.description,
  priority: task.priority,
  difficulty: task.difficulty,
  type: task.type,
  due_date: task.due_date,
  kanban_column_id: task.kanban_column_id,
  codev_id: task.codev_id,
  created_by: task.created_by,
  sidekick_ids: task.sidekick_ids,
  points: task.points,
  is_archive: task.is_archive,
  pr_link: task.pr_link,
  created_at: task.created_at,
  updated_at: task.updated_at,
  skill_category_id: task.skill_category_id,
  codev: task.codev,
  skill_category: task.skill_category,
});

const mapColumn = (column: any): KanbanColumnType => ({
  id: String(column.id),
  board_id: column.board_id,
  name: column.name,
  position: column.position,
  created_at: column.created_at,
  updated_at: column.updated_at,
  tasks: Array.isArray(column.tasks)
    ? column.tasks.filter((task: any) => !task.is_archive).map(mapTask)
    : [],
});

export default function KanbanBoardPage({
  params,
  searchParams,
}: KanbanBoardPageProps) {
  const { boardData, fetchBoardData, setBoardId } = useKanbanStore();
  const [loading, setLoading] = useState(true);

  const query = searchParams?.query?.toLowerCase() || "";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        setBoardId(params.id); // no need to await if this is a Zustand setter
        await fetchBoardData();
      } catch (err) {
        console.error("Failed to load board data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id, fetchBoardData, setBoardId]);

  const processedBoardData = useMemo(() => {
    if (!boardData) return null;

    const mappedColumns: KanbanColumnType[] = Array.isArray(
      boardData.kanban_columns,
    )
      ? boardData.kanban_columns.map(mapColumn)
      : [];

    const filteredColumns = query
      ? mappedColumns.map((column) => ({
          ...column,
          tasks: (column.tasks || []).filter(
            (task) =>
              task.title.toLowerCase().includes(query) ||
              task.description?.toLowerCase().includes(query) ||
              task.codev?.first_name?.toLowerCase().includes(query) ||
              task.codev?.last_name?.toLowerCase().includes(query) ||
              task.skill_category?.name?.toLowerCase().includes(query),
          ),
        }))
      : mappedColumns;

    return {
      ...boardData,
      id: String(boardData.id),
      kanban_columns: filteredColumns,
    } as KanbanBoardType & { kanban_columns: KanbanColumnType[] };
  }, [boardData, query]);

  if (loading) {
    return <KanbanLoadingSkeleton />;
  }

  if (!processedBoardData) {
    return <div>Board not found</div>;
  }

  return (
    <KanbanBoard projectId={params.projectId} boardData={processedBoardData} />
  );
}
