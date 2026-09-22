import { Skeleton } from "@/components/ui/skeleton/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function KanbanBoardsLoading() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 pt-4">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
          <Table>
            <TableHeader className="hidden md:table-header-group">
              <TableRow className="border-0 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <TableHead className="w-[30%] font-semibold text-gray-900 dark:text-white">
                  🚀 Project
                </TableHead>
                <TableHead className="w-[30%] font-semibold text-gray-900 dark:text-white">
                  👑 Team Lead
                </TableHead>
                <TableHead className="w-[10%] text-center font-semibold text-gray-900 dark:text-white">
                  ⚡ Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white dark:bg-gray-950">
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={`loading-${index}`}
                  className="grid grid-cols-1 md:table-row"
                >
                  {/* Project Name Column */}
                  <TableCell className="md:table-cell">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-24 md:w-32" />
                    </div>
                  </TableCell>

                  {/* Team Lead Column */}
                  <TableCell className="md:table-cell">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28 md:w-36" />
                    </div>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell className="text-center md:table-cell">
                    <div className="flex justify-center">
                      <Skeleton className="h-9 w-24 rounded-md md:w-28" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
