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
import type { ProjectListItem } from "@/types/home/kanban/kanban";

function formatDate(value: string | null) {
  if (!value) return "\u2014";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}

export default function KanbanProjectsTable({
  projects,
}: {
  projects: ProjectListItem[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Table>
        <TableCaption className="sr-only">Kanban projects</TableCaption>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 bg-gray-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800">
            <TableHead scope="col">Name</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col">Project code</TableHead>
            <TableHead scope="col">Dates</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id} className="relative cursor-pointer">
              <TableCell>
                <Link
                  href={`${pathsConfig.app.kanban}/${project.id}`}
                  className="font-medium underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-customBlue-100 hover:underline"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.status ?? "\u2014"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {project.projectCode ?? "\u2014"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(project.startDate)} {"\u2013"}{" "}
                {formatDate(project.endDate)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
