"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconFacebook, IconGithub, IconLink } from "@/public/assets/svgs";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Checkbox } from "@codevs/ui/checkbox";

import { NewApplicantType } from "../../_service/types";
import ApplicantReapplyTime from "../applicantReapplyTime";
import ApplicantTechStack from "../applicantTechStack";
import ApplicantTestTimeRemaining from "../applicantTestTimeRemaining";
import ApplicantActionButton from "./applicantActionButton";
import ApplicantProfileColSec from "./applicantProfileColSec";

// Base columns that appear in all tabs
const baseColumns: ColumnDef<NewApplicantType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="h-4 w-4 border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="h-4 w-4 border-2 border-gray-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "w-10 text-center",
    },
  },
  {
    id: "applicant",
    accessorKey: "first_name",
    meta: {
      className: "w-[220px]",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-8 items-center justify-start gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Applicant
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <>
          <ApplicantProfileColSec applicant={applicant} row={row} />
        </>
      );
    },
  },
  {
    accessorKey: "display_position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-8 items-center justify-start gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Position
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="px-2 py-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
              {applicant.display_position || "Not specified"}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {applicant.years_of_experience !== undefined
                ? `${applicant.years_of_experience} ${
                    applicant.years_of_experience === 1 ? "yr" : "yrs"
                  }`
                : "No exp"}
            </span>
          </div>
        </div>
      );
    },
    meta: {
      className: "w-[140px]",
    },
  },
  {
    id: "links",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Links
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-start gap-1 px-2 py-2">
          {applicant.github ? (
            <Link
              href={applicant.github}
              target="_blank"
              className="rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="GitHub"
            >
              <IconGithub className="h-3.5 w-3.5 invert dark:invert-0" />
            </Link>
          ) : (
            <div className="w-5 h-5"></div>
          )}
          {applicant.facebook ? (
            <Link
              href={applicant.facebook}
              target="_blank"
              className="rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Facebook"
            >
              <IconFacebook className="h-3.5 w-3.5 invert dark:invert-0" />
            </Link>
          ) : (
            <div className="w-5 h-5"></div>
          )}
          {applicant.portfolio_website ? (
            <Link
              href={applicant.portfolio_website}
              target="_blank"
              className="rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Portfolio"
            >
              <IconLink className="h-3.5 w-3.5 invert dark:invert-0" />
            </Link>
          ) : (
            <div className="w-5 h-5"></div>
          )}
          {!applicant.github && !applicant.facebook && !applicant.portfolio_website && (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              None
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-16 text-center",
    },
  },
  {
    id: "tech_stacks",
    accessorKey: "tech_stacks",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-8 items-center justify-start gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Tech
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const lengthA = rowA.original.tech_stacks?.length || 0;
      const lengthB = rowB.original.tech_stacks?.length || 0;
      return lengthA - lengthB;
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="px-2 py-2">
          <ApplicantTechStack applicant={applicant} />
        </div>
      );
    },
    meta: {
      className: "w-28",
    },
  },
  {
    accessorKey: "date_applied",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Applied
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant: NewApplicantType = row.original;

      return (
        <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-2">
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            {applicant.date_applied
              ? new Date(applicant.date_applied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
              : "N/A"}
          </span>
          {applicant.application_status !== "denied" && (
            <div className="flex items-center gap-1">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[10px] font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                {applicant.applicant?.reminded_count ?? 0}
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                rem
              </span>
            </div>
          )}
        </div>
      );
    },
    meta: {
      className: "w-28 text-center",
    },
  },
  {
    id: "test_taken",
    accessorKey: "applicant.test_taken",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Test
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex flex-col items-center justify-center gap-0.5 px-2 py-2">
          <span className="text-[10px] font-medium text-gray-900 dark:text-gray-100">
            {applicant.applicant?.test_taken
              ? new Date(applicant.applicant.test_taken).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : "Not taken"}
          </span>
          <div className="text-[10px]">
            <ApplicantTestTimeRemaining applicant={applicant} />
          </div>
        </div>
      );
    },
    meta: {
      className: "w-24 text-center",
    },
  },
  {
    id: "fork_url",
    accessorKey: "applicant.fork_url",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Fork
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center px-2 py-2">
          {applicant.applicant?.fork_url ? (
            <Link
              href={applicant.applicant.fork_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-1 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <IconLink className="h-3.5 w-3.5 text-gray-600 dark:text-gray-200" />
            </Link>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              N/A
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-16 text-center",
    },
  },
  {
    id: "reapply",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Reapply
          <ArrowUpDown className="h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center px-2 py-2">
          <ApplicantReapplyTime applicant={applicant} />
        </div>
      );
    },
    meta: {
      className: "w-24 text-center",
    },
    enableHiding: true,
  },
  {
    id: "actions",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Actions
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center px-2 py-2">
          <ApplicantActionButton applicant={applicant} />
        </div>
      );
    },
    meta: {
      className: "w-20",
    },
  },
];

// Waitlist-only columns (Mobile Dev and Commitment)
const waitlistColumns: ColumnDef<NewApplicantType>[] = [
  {
    id: "mobile_capability",
    accessorKey: "applicant.can_do_mobile",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Mobile
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;
      const canDoMobile = applicant.applicant?.can_do_mobile;

      return (
        <div className="flex items-center justify-center px-2 py-2">
          {canDoMobile === true ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Yes
            </span>
          ) : canDoMobile === false ? (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
              No
            </span>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              N/A
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-24 text-center",
    },
  },
  {
    id: "commitment",
    accessorKey: "applicant.commitment_signed_at",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-8 items-center justify-center gap-1 px-2 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Commit
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;
      const commitmentSigned = applicant.applicant?.commitment_signed_at;

      return (
        <div className="flex items-center justify-center px-2 py-2">
          {commitmentSigned ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Signed
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {new Date(commitmentSigned).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Not signed
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-28 text-center",
    },
  },
];

/**
 * Get the appropriate columns for a specific tab
 * - Waitlist tab: includes Mobile Dev and Commitment columns
 * - All other tabs: only base columns
 */
export function getApplicantColumns(tab: string): ColumnDef<NewApplicantType>[] {
  if (tab === "waitlist") {
    // Insert waitlist columns before the reapply and actions columns
    const reapplyIndex = baseColumns.findIndex(col => col.id === "reapply");
    return [
      ...baseColumns.slice(0, reapplyIndex),
      ...waitlistColumns,
      ...baseColumns.slice(reapplyIndex),
    ];
  }

  return baseColumns;
}

// Keep the original export for backward compatibility
export const applicantsColumns = baseColumns;
