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
    <div className="space-y-1 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <Table className="table">
        {/* Table header */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="border-b border-gray-200 bg-gray-50 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-800"
            >
              {headerGroup.headers
                .filter((_, index) => index === 0) // show ONLY 1st column
                .map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-12 whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100",
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
                  "border-b border-gray-100 transition-colors hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/50",
                  row.getIsSelected() && "bg-blue-50 dark:bg-blue-900/20",
                  (row.original as NewApplicantType).application_status ===
                  "testing" &&
                  (row.original as NewApplicantType).applicant?.fork_url &&
                  "bg-green-50 hover:bg-green-100/50 dark:bg-green-900/20 dark:hover:bg-green-900/30",
                  (row.original as NewApplicantType).application_status ===
                  "testing" &&
                  toBeFailed(
                    (row.original as NewApplicantType).applicant?.test_taken,
                    (row.original as NewApplicantType).applicant?.fork_url,
                  ) &&
                  "bg-red-50 hover:bg-red-100/50 dark:bg-red-900/20 dark:hover:bg-red-900/30",
                )}
              >
                {row
                  .getVisibleCells()
                  .filter((_, index) => index <= 1) //show 1st and 2nd columns
                  .map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-4 py-2",
                        (cell.column.columnDef.meta as any)?.className,
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell
                // now we render 2 columns, so colspan = 2
                colSpan={2}
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
  );
}

export default ApplicantMobileTable;
