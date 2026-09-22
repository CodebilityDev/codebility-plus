import { Box } from "@/components/shared/dashboard";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRightIcon } from "@/public/assets/svgs";

import PageContainer from "../../_components/PageContainer";

export default function KanbanSprintLoading() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-4">
        {/* Breadcrumb */}
        <nav className="flex flex-row items-center gap-3 pb-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            📋 Kanban Board
          </span>
          <ArrowRightIcon
            className="text-gray-400 dark:text-gray-500"
            aria-hidden="true"
          />
          <Skeleton className="h-4 w-32" />
        </nav>

        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-28" />
        </header>

        {/* Table */}
        <main className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <TableHead className="w-[45%] font-semibold text-gray-900 dark:text-white">
                  🏃‍♂️ Sprint
                </TableHead>
                <TableHead className="w-[45%] font-semibold text-gray-900 dark:text-white">
                  📅 Timeline
                </TableHead>
                <TableHead className="w-[10%] text-center font-semibold text-gray-900 dark:text-white">
                  ⚡ Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-gray-950">
              {Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={4}>
                    <Box className="flex-1">
                      <div className="flex flex-col items-center gap-3">
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </main>
      </div>
    </PageContainer>
  );
}
