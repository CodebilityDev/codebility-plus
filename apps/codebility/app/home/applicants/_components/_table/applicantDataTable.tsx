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
    <div className="overflow-hidden rounded-md">
      <Box className="p-2">
        {/* if rows selected */}

        <div className="flex w-full items-center justify-between">
          <div className="flex w-full items-center gap-2 px-1 pb-1">
            <p className="text-sm text-gray-500">
              {Object.keys(rowSelection).length} selected
            </p>

            <ApplicantRowActionButton
              applicants={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original)}
            />
          </div>

          {/* <div>
            
            {data[0]?.application_status !== "denied" && (
              <ApplicantEmailAction applicants={data} />
            )}
          </div> */}
        </div>

        {/* Table for larger screens */}
        <Table className="hidden xl:table table-auto">
          {/* Table header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap px-2 py-1 text-xs",
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
                    row.original.application_status === "testing" &&
                      row.original.applicant?.fork_url &&
                      "bg-green bg-opacity-5",
                    row.original.application_status === "testing" &&
                      toBeFailed(
                        row.original.applicant?.test_taken,
                        row.original.applicant?.fork_url,
                      ) &&
                      "bg-customRed-100 bg-opacity-5",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-2 py-1",
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

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
      </Box>
    </div>
  );
}

export const ApplicantDataTable = ApplicantDataTableComponent;
