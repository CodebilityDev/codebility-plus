"use client";

import React, { useCallback, useMemo } from "react";
import { getTestDate } from "@/app/applicant/waiting/_service/util";
import { Box } from "@/components/shared/dashboard";
import DefaultPagination from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pageSize } from "@/constants";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { NewApplicantType } from "../../_service/types";
import ApplicantEmailAction from "../applicantEmailAction";
import ApplicantMobileTable from "./applicantMobileTable";
import ApplicantRowActionButton from "./applicantRowActionButton";

interface DataTableProps<TData extends NewApplicantType, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function ApplicantDataTableComponent<TData extends NewApplicantType, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: Number(pageSize.applicants),
  });

  // Memoize initial column visibility to prevent recalculation
  const initialColumnVisibility = useMemo(
    () => ({
      github: data[0]?.application_status === "testing" ? false : true,
      tech_stacks: data[0]?.application_status === "testing" ? false : true,
      test_taken: data[0]?.application_status === "testing" ? true : false,
      test_time_remaining:
        data[0]?.application_status === "testing" ? true : false,
      fork_url: data[0]?.application_status === "testing" ? true : false,
      reapply: data[0]?.application_status === "denied" ? true : false,
      reminded: data[0]?.application_status !== "denied" ? true : false,
    }),
    [data[0]?.application_status],
  );

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(data.length / pagination.pageSize),
    [data.length, pagination.pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getRowId: (row) => row.id, // Use applicant ID instead of array index
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    initialState: {
      columnVisibility: initialColumnVisibility,
    },
    pageCount: totalPages,
    manualPagination: false,
  });

  const toBeFailed = useCallback(
    (
      testTaken: string | null | undefined,
      forkUrl: string | null | undefined,
    ): Boolean => {
      if (!testTaken) return false;
      if (forkUrl) return false;

      const currentDate = new Date();

      const testTakenDate = getTestDate(
        new Date(testTaken || "") || new Date(),
      );

      const difference = testTakenDate.getTime() - currentDate.getTime();

      return difference <= 0;
    },
    [],
  );

  // Define pagination callbacks outside of conditional rendering
  const handleNextPage = useCallback(() => {
    table.nextPage();
  }, [table]);

  const handlePreviousPage = useCallback(() => {
    table.previousPage();
  }, [table]);

  const setCurrentPage = useCallback(
    (page: number) => {
      table.setPageIndex(page - 1);
    },
    [table],
  );

  // Clear row selection when page changes
  React.useEffect(() => {
    setRowSelection({});
  }, [pagination.pageIndex]);

  // Reset pagination when data changes significantly (different length)
  const prevDataLength = React.useRef(data.length);
  React.useEffect(() => {
    if (prevDataLength.current !== data.length) {
      // Only reset if we're beyond the available pages
      const newTotalPages = Math.ceil(data.length / pagination.pageSize);
      if (pagination.pageIndex >= newTotalPages && newTotalPages > 0) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
      prevDataLength.current = data.length;
    }
  }, [data.length, pagination.pageIndex, pagination.pageSize]);

  return (
    <div className="space-y-4">
      {/* Selection and actions bar */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {Object.keys(rowSelection).length}
                </span>
              </div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {Object.keys(rowSelection).length} applicant{Object.keys(rowSelection).length !== 1 ? 's' : ''} selected
              </p>
            </div>
            <ApplicantRowActionButton
              applicants={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original)}
              onActionComplete={() => setRowSelection({})}
            />
          </div>
        </div>
      )}

      {/* Table for larger screens */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <Table className="hidden xl:table w-full table-fixed">
          {/* Table header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow

                key={headerGroup.id}
                className="border-b-2 border-gray-200 bg-gray-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-12 whitespace-nowrap px-0 py-0",
                        (header.column.columnDef.meta as any)?.className,
                      )}
                    >
      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={`${row.id}-${row.index}`}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "border-b border-gray-200 transition-colors hover:bg-gray-50/50 dark:border-gray-700 dark:hover:bg-gray-800/50",
                    row.getIsSelected() && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
                    row.original.application_status === "testing" &&
                    row.original.applicant?.fork_url &&
                    "bg-green-50 hover:bg-green-100/50 dark:bg-green-900/20 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800",
                    row.original.application_status === "testing" &&
                    toBeFailed(
                      row.original.applicant?.test_taken,
                      row.original.applicant?.fork_url,
                    ) &&
                    "bg-red-50 hover:bg-red-100/50 dark:bg-red-900/20 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800",

                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-0 py-2.5",
                        (cell.column.columnDef.meta as any)?.className,
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No applicants found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table for smaller screens */}
      <div className="xl:hidden">
        <ApplicantMobileTable table={table} />
      </div>

      {/* Table pagination integrated with DefaultPagination component */}
      <div className="relative w-full">
        {data.length > pagination.pageSize && (
          <DefaultPagination
            currentPage={table.getState().pagination.pageIndex + 1}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    </div>
  );
}

export const ApplicantDataTable = ApplicantDataTableComponent;
