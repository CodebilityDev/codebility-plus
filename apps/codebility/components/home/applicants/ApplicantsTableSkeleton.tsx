import { Skeleton } from "@/components/global/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/home/applicants/table";

export function ApplicantsTableSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-1 items-center">
          <Skeleton className="h-9 w-56" />
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <Skeleton className="hidden h-11 w-80 md:block" />
          <Skeleton className="h-11 w-28" />
          <Skeleton className="h-11 w-28" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1 md:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-10" />
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm xl:block dark:border-gray-700 dark:bg-gray-900">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="border-b-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <TableHead className="w-10 px-0" />
              <TableHead className="w-[220px] px-0" />
              <TableHead className="w-[140px] px-0" />
              <TableHead className="w-16 px-0" />
              <TableHead className="w-28 px-0" />
              <TableHead className="w-28 px-0" />
              <TableHead className="w-20 px-0" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }, (_, index) => (
              <TableRow
                key={index}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <TableCell className="px-0 py-4">
                  <Skeleton className="mx-auto h-4 w-4" />
                </TableCell>
                <TableCell className="px-0 py-4">
                  <div className="flex items-center gap-2 px-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-2.5 w-20" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-0 py-4">
                  <div className="flex flex-col gap-1 px-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2.5 w-12" />
                  </div>
                </TableCell>
                <TableCell className="px-0 py-4">
                  <Skeleton className="mx-auto h-4 w-8" />
                </TableCell>
                <TableCell className="px-0 py-4">
                  <div className="flex gap-1 px-2">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-6" />
                  </div>
                </TableCell>
                <TableCell className="px-0 py-4">
                  <Skeleton className="mx-auto h-3 w-14" />
                </TableCell>
                <TableCell className="px-0 py-4">
                  <Skeleton className="mx-auto h-6 w-10 rounded-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-1 rounded-lg border border-gray-200 bg-white shadow-sm xl:hidden dark:border-gray-700 dark:bg-gray-900">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
