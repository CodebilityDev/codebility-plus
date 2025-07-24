import Image from "next/image";
import { Paragraph } from "../components/shared/home";
import {
  KanbanBoardType,
  KanbanColumnType,
  Project,
  Task,
} from "@/types/home/codev";

interface Props {
  task: TaskWithRelations; // Updated type to include relations
}

interface TaskWithRelations extends Task {
  kanban_column?: KanbanColumnType & {
    board?: KanbanBoardType & {
      project?: Project;
    };
  };
}

export default function TaskCard({ task }: Props) {
  const {
    id,
    title,
    description,
    priority,
    points,
    created_at,
    type,
    due_date,
    kanban_column,
  } = task;

  // Safely access the project name from the nested structure
  const projectName =
    kanban_column?.board?.project?.name || "No associated project";

  return (
    <div className="background-box text-dark100_light900 hover:border-violet cursor-pointer rounded border border-zinc-200 p-6 shadow-sm dark:border-zinc-700">
      <div className="flex h-full flex-col justify-between">
        <div className="relative flex flex-col gap-1">
          <Image
            width={20}
            height={20}
            src={`/assets/svgs/icon-priority-${
              priority?.toLowerCase() || "medium"
            }.svg`}
            className="absolute right-0 top-0"
            alt="Priority level"
            title={priority}
          />
          <p className="text-violet text-lg font-semibold">#{id}</p>
          <p>{title}</p>
          {description && <Paragraph>{description}</Paragraph>}

          <div className="text-gray flex items-center gap-2 text-xs">
            <p className="text-dark-100 text-sm dark:text-white">
              Project: {projectName}
            </p>
          </div>

          {points !== undefined && (
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Points:{" "}
              <p className="text-dark-100 text-sm dark:text-white">{points}</p>
            </div>
          )}

          {created_at && (
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Created at:{" "}
              <p className="text-dark-100 text-sm dark:text-white">
                {new Date(created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}

          {status && (
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Status:{" "}
              <p className="text-dark-100 text-sm dark:text-white">{status}</p>
            </div>
          )}

          {type && (
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Type:{" "}
              <p className="text-dark-100 text-sm dark:text-white">{type}</p>
            </div>
          )}

          {due_date && (
            <div className="text-gray mt-1 flex items-center gap-2 text-xs">
              Due Date:{" "}
              <p className="text-dark-100 text-sm dark:text-white">
                {new Date(due_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
