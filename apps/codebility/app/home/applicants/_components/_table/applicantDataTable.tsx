"use client";

import React from "react";
import { getTestDate } from "@/app/applicant/waiting/_service/util";
import { Box } from "@/Components/shared/dashboard";
import DefaultPagination from "@/Components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
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

export function ApplicantDataTable<TData extends NewApplicantType, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize.applicants,
      },
      columnVisibility: {
        github: data[0]?.application_status === "testing" ? false : true,
        tech_stacks: data[0]?.application_status === "testing" ? false : true,
        test_taken: data[0]?.application_status === "testing" ? true : false,
        test_time_remaining:
          data[0]?.application_status === "testing" ? true : false,
        fork_url: data[0]?.application_status === "testing" ? true : false,
        reapply: data[0]?.application_status === "denied" ? true : false,
      },
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil(data.length / pageSize.applicants);

  const toBeFailed = (
    testTaken: string | null | undefined,
    forkUrl: string | null | undefined,
  ): Boolean => {
    if (!testTaken) return false;
    if (forkUrl) return false;

    const currentDate = new Date();

    const testTakenDate = getTestDate(new Date(testTaken || "") || new Date());

    const difference = testTakenDate.getTime() - currentDate.getTime();

    return difference <= 0;
  };

  return (
    <div className="rounded-md border">
      <Box className="p-1 py-2 sm:p-4 sm:py-4">
        {/* if rows selected */}

        <div className="justify-betwee flex w-full items-center">
          <div className="hidden w-full items-center gap-4 px-2 pb-2 xl:flex">
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
        <Table className="hidden xl:table">
          {/* Table header */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "whitespace-nowrap",
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
                  key={row.id}
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
                      "bg-red-100 bg-opacity-5",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
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
        <ApplicantMobileTable table={table} />

        {/* Table pagination integrated with DefaultPagination component */}
        <div className="relative w-full">
          {data.length > pageSize.applicants && (
            <DefaultPagination
              currentPage={table.getState().pagination.pageIndex + 1}
              handleNextPage={() => {
                if (table.getState().pagination.pageIndex < totalPages - 1) {
                  table.nextPage();
                }
              }}
              handlePreviousPage={() => table.previousPage()}
              setCurrentPage={(pageOrFunction) => {
                const page =
                  typeof pageOrFunction === "function"
                    ? pageOrFunction(table.getState().pagination.pageIndex + 1)
                    : pageOrFunction;
                table.setPageIndex(page - 1);
              }}
              totalPages={totalPages}
            />
          )}
        </div>
      </Box>
    </div>
  );
}
