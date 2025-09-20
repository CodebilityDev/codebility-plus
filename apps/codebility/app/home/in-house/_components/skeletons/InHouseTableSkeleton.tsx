import { Skeleton } from "@codevs/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@codevs/ui/table";

interface InHouseTableSkeletonProps {
  rows?: number;
}

export function InHouseTableSkeleton({ rows = 8 }: InHouseTableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Mobile skeleton - hidden on XL+ screens */}
      <div className="space-y-3 xl:hidden">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="rounded-lg border border-light-700 bg-light-300 p-4 dark:border-dark-200 dark:bg-dark-100"
          >
            <div className="flex items-start gap-3">
              {/* Avatar skeleton */}
              <Skeleton className="h-12 w-12 rounded-full" />
              
              <div className="flex-1 space-y-2">
                {/* Name and email skeleton */}
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-48" />
                
                {/* Status badges skeleton */}
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                
                {/* Additional info skeleton */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              
              {/* Actions skeleton */}
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table skeleton - hidden on mobile, visible on XL+ screens */}
      <div className="hidden rounded-lg border border-light-700 bg-light-300 dark:border-dark-200 dark:bg-dark-100 xl:block">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-light-700 bg-light-200 dark:border-dark-200 dark:bg-dark-300">
              {/* Avatar column */}
              <TableHead className="px-1 py-2">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              {/* First Name column */}
              <TableHead className="px-1 py-2">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              {/* Last Name column */}
              <TableHead className="px-1 py-2">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              {/* Email column */}
              <TableHead className="px-1 py-2">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              {/* Desktop-only columns */}
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead className="hidden px-1 py-2 2xl:table-cell">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              {/* Info column for mobile */}
              <TableHead className="px-1 py-2 2xl:hidden">
                <Skeleton className="h-4 w-12" />
              </TableHead>
              {/* Actions column */}
              <TableHead className="px-1 py-2">
                <Skeleton className="h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, index) => (
              <TableRow
                key={index}
                className="border-b border-light-700 hover:bg-light-800 odd:bg-grey-100/10 dark:border-dark-200 dark:hover:bg-dark-300 odd:dark:bg-dark-200"
              >
                {/* Avatar column */}
                <TableCell className="px-1 py-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                </TableCell>
                
                {/* First Name column */}
                <TableCell className="px-1 py-3">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                
                {/* Last Name column */}
                <TableCell className="px-1 py-3">
                  <Skeleton className="h-4 w-18" />
                </TableCell>
                
                {/* Email column */}
                <TableCell className="px-1 py-3">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                
                {/* Mobile Info Dropdown - Hidden on 2XL+ screens */}
                <TableCell className="px-1 py-3 2xl:hidden">
                  <Skeleton className="h-4 w-6" />
                </TableCell>

                {/* Desktop-only columns - Hidden on smaller screens */}
                {/* Status Badge column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <Skeleton className="h-5 w-16 rounded-full" />
                </TableCell>

                {/* Role column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <Skeleton className="h-4 w-12" />
                </TableCell>

                {/* Position column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* Projects column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </TableCell>

                {/* NDA Status column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-6 w-12 rounded" />
                  </div>
                </TableCell>

                {/* Portfolio column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <Skeleton className="h-4 w-16" />
                </TableCell>

                {/* Date Joined column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <Skeleton className="h-4 w-20" />
                </TableCell>

                {/* Availability Status column */}
                <TableCell className="hidden px-1 py-3 2xl:table-cell">
                  <Skeleton className="h-6 w-12 rounded-full" />
                </TableCell>

                {/* Actions column */}
                <TableCell className="px-1 py-3">
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-20 rounded" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
