"use client";

import React from "react";
import { Box } from "@/Components/shared/dashboard";
import { Button } from "@/Components/ui/button";
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
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { NewApplicantType } from "../../_service/types";

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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: pageSize.applicants,
      },
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil(data.length / pageSize.applicants);

  return (
    <div className="rounded-md border">
      <Box>
        {/* if row selected */}
        {table.getFilteredSelectedRowModel().rows[0]?.original
          ?.application_status === "testing" && (
          <div className="w-1/2">
            {Object.keys(rowSelection).length > 0 && (
              <div className="flex w-full items-center gap-4 p-4">
                <p className="text-sm text-gray-500">
                  {Object.keys(rowSelection).length} selected
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const selectedRows = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original);
                    console.log("Selected applicants:", selectedRows);
                  }}
                  className="w-fit"
                >
                  Pass All
                </Button>

                <Button className="w-fit">Fail All</Button>

                <ApplicantRowActionButton
                  applicants={table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original)}
                />
              </div>
            )}
          </div>
        )}

        {table.getFilteredSelectedRowModel().rows[0]?.original
          ?.application_status === "onboarding" && (
          <div className="w-1/2">
            {Object.keys(rowSelection).length > 0 && (
              <div className="flex w-full items-center gap-4 p-4">
                <p className="text-sm text-gray-500">
                  {Object.keys(rowSelection).length} selected
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    const selectedRows = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.original);
                    console.log("Selected applicants:", selectedRows);
                  }}
                  className="w-fit"
                >
                  Accept All
                </Button>

                <Button className="w-fit">Deny All</Button>

                <ApplicantRowActionButton
                  applicants={table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.original)}
                />
              </div>
            )}
          </div>
        )}

        <Table>
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

        {/* Table pagination integrated with DefaultPagination component */}
        <div className="relative w-full">
          {data.length > pageSize.applicants && (
            <DefaultPagination
              currentPage={table.getState().pagination.pageIndex + 1}
              handleNextPage={() => table.nextPage()}
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

export default function ApplicantRowActionButton({
  applicants,
}: {
  applicants: NewApplicantType[];
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
          >
            <span className="sr-only">More actions</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="dark:bg-dark-200 min-w-[160px] bg-white"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
            Move to Applying
          </DropdownMenuItem>
          <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
            Move to Onboarding
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-red-500">
            Move to Denied
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
