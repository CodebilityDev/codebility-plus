"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table as TableInstance,
  useReactTable,
} from "@tanstack/react-table";

import { NewApplicantType } from "../../_service/types";
import ApplicantRowActionButton from "./applicantRowActionButton";

export default function ApplicantMobileTable<TData extends NewApplicantType>({
  table,
}: {
  table: TableInstance<TData>;
}) {
  return (
    <>
      {/* Table for smaller screens */}
      <Table className="table xl:hidden">
        {/* Table header */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.slice(0, 1).map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "whitespace-nowrap",
                      (header.column.columnDef.meta as any)?.className,
                    )}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}

                      <div className="mt-1 flex w-full items-center gap-4 px-4 xl:hidden">
                        <p className="text-sm text-gray-500">
                          {table.getFilteredSelectedRowModel().rows.length}{" "}
                          selected
                        </p>

                        <ApplicantRowActionButton
                          applicants={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        />
                      </div>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="table-row"
              >
                {row
                  .getVisibleCells()
                  .slice(1, 2)
                  .map((cell) => (
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
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
