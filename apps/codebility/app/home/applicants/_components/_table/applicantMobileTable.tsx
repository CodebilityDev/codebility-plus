"use client";

import React from "react";
import { getTestDate } from "@/app/applicant/waiting/_service/util";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender, Table as ReactTable } from "@tanstack/react-table";

import { NewApplicantType } from "../../_service/types";

interface ApplicantMobileTableProps<TData extends NewApplicantType> {
  table: ReactTable<TData>;
}

function ApplicantMobileTable<TData extends NewApplicantType>({
  table,
}: ApplicantMobileTableProps<TData>) {
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
    <Table className="table">
      {/* Table header */}
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers
              .filter((_, index) => index <= 1) // 👈 show 1st and 2nd columns
              .map((header) => (
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
              ))}
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
                (row.original as NewApplicantType).application_status ===
                  "testing" &&
                  (row.original as NewApplicantType).applicant?.fork_url &&
                  "bg-green bg-opacity-5",
                (row.original as NewApplicantType).application_status ===
                  "testing" &&
                  toBeFailed(
                    (row.original as NewApplicantType).applicant?.test_taken,
                    (row.original as NewApplicantType).applicant?.fork_url,
                  ) &&
                  "bg-customRed-100 bg-opacity-5",
              )}
            >
              {row
                .getVisibleCells()
                .filter((_, index) => index <= 1) // 👈 show 1st and 2nd columns
                .map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      (cell.column.columnDef.meta as any)?.className,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              // now we render 2 columns, so colspan = 2
              colSpan={2}
              className="h-24 text-center"
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ApplicantMobileTable;
