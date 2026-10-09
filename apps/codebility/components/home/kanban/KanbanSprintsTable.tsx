import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@codevs/ui/table";

import pathsConfig from "@/constants/global/paths";
import type { SprintListItem } from "@/types/home/kanban/kanban";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}

export default function KanbanSprintsTable({
  projectId,
  sprints,
}: {
  projectId: string;
  sprints: SprintListItem[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Table>
        <TableCaption className="sr-only">Sprints for this project</TableCaption>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 bg-gray-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800">
            <TableHead scope="col">Name</TableHead>
            <TableHead scope="col">Start</TableHead>
            <TableHead scope="col">End</TableHead>
            <TableHead scope="col">Board</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sprints.map((sprint) => (
            <TableRow key={sprint.id} className="relative cursor-pointer">
              <TableCell>
                <Link
                  href={`${pathsConfig.app.kanban}/${projectId}/${sprint.id}`}
                  className="font-medium underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-customBlue-100 hover:underline"
                >
                  {sprint.name ?? "Untitled sprint"}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(sprint.startAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(sprint.endAt)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {sprint.hasBoard ? "Ready" : "Not created"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
