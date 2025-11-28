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

export const applicantsColumns: ColumnDef<NewApplicantType>[] = [
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
      className: "w-12 text-center",
    },
  },
  {
    id: "applicant",
    accessorKey: "first_name",
    meta: {
      className: "min-w-[280px] max-w-[350px]",
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-10 items-center justify-start gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Applicant
          <ArrowUpDown className="h-4 w-4" />
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
          className="flex h-10 items-center justify-start gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Position & Experience
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {applicant.display_position || "Not specified"}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {applicant.years_of_experience !== undefined
                ? `${applicant.years_of_experience} ${
                    applicant.years_of_experience === 1 ? "year" : "years"
                  } exp`
                : "No experience specified"}
            </span>
          </div>
        </div>
      );
    },
    meta: {
      className: "min-w-[160px] max-w-[200px]",
    },
  },
  {
    id: "links",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Links
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-start gap-2 px-3 py-2">
          {applicant.github ? (
            <Link
              href={applicant.github}
              target="_blank"
              className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="GitHub"
            >
              <IconGithub className="h-4 w-4 invert dark:invert-0" />
            </Link>
          ) : (
            <div className="w-7 h-7"></div>
          )}
          {applicant.facebook ? (
            <Link
              href={applicant.facebook}
              target="_blank"
              className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Facebook"
            >
              <IconFacebook className="h-4 w-4 invert dark:invert-0" />
            </Link>
          ) : (
            <div className="w-7 h-7"></div>
          )}
          {applicant.portfolio_website ? (
            <Link
              href={applicant.portfolio_website}
              target="_blank"
              className="rounded-full p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              title="Portfolio"
            >
              <IconLink className="h-4 w-4 invert dark:invert-0" />
            </Link>
          ) : (
            <div className="w-7 h-7"></div>
          )}
          {!applicant.github && !applicant.facebook && !applicant.portfolio_website && (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              None
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-20 text-center",
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
          className="flex h-10 items-center justify-start gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Tech Stacks
          <ArrowUpDown className="h-4 w-4" />
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
        <div className="px-3 py-2">
          <ApplicantTechStack applicant={applicant} />
        </div>
      );
    },
    meta: {
      className: "w-40",
    },
  },
  {
    accessorKey: "date_applied",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Date Applied
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant: NewApplicantType = row.original;

      return (
        <div className="flex flex-col items-center justify-center gap-1 px-3 py-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {applicant.date_applied
              ? new Date(applicant.date_applied).toLocaleDateString()
              : "N/A"}
          </span>
          {applicant.application_status !== "denied" && (
            <div className="flex items-center gap-1">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                {applicant.applicant?.reminded_count ?? 0}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                reminders
              </span>
            </div>
          )}
        </div>
      );
    },
    meta: {
      className: "w-36 text-center",
    },
  },
  {
    accessorKey: "application_status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Status
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant: NewApplicantType = row.original;
      const status = applicant.application_status;

      const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold";

        switch (status) {
          case "applying":
            return (
              <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`}>
                Applying
              </span>
            );
          case "testing":
            return (
              <span className={`${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400`}>
                Testing
              </span>
            );
          case "onboarding":
            return (
              <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`}>
                Onboarding
              </span>
            );
          case "waitlist":
            return (
              <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`}>
                Waitlist
              </span>
            );
          case "accepted":
            return (
              <span className={`${baseClasses} bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400`}>
                Accepted
              </span>
            );
          case "denied":
            return (
              <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`}>
                Denied
              </span>
            );
          default:
            return (
              <span className={`${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`}>
                {status || "Unknown"}
              </span>
            );
        }
      };

      return (
        <div className="flex items-center justify-center px-3 py-2">
          {getStatusBadge(status)}
        </div>
      );
    },
    meta: {
      className: "w-32 text-center",
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
          className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Test Status
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex flex-col items-center justify-center gap-1 px-3 py-2">
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
            {applicant.applicant?.test_taken
              ? new Date(applicant.applicant.test_taken).toLocaleDateString()
              : "Not taken"}
          </span>
          <div className="text-xs">
            <ApplicantTestTimeRemaining applicant={applicant} />
          </div>
        </div>
      );
    },
    meta: {
      className: "w-32 text-center",
    },
  },
  {
    id: "fork_url",
    accessorKey: "applicant.fork_url",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Fork URL
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center px-3 py-2">
          {applicant.applicant?.fork_url ? (
            <Link
              href={applicant.applicant.fork_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <IconLink className="h-5 w-5 text-gray-600 dark:text-gray-200" />
            </Link>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-500">
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
    id: "mobile_capability",
    accessorKey: "applicant.can_do_mobile",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Mobile Dev
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;
      const canDoMobile = applicant.applicant?.can_do_mobile;

      return (
        <div className="flex items-center justify-center px-3 py-2">
          {canDoMobile === true ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Yes
            </span>
          ) : canDoMobile === false ? (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
              No
            </span>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              N/A
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-28 text-center",
    },
  },
  {
    id: "commitment",
    accessorKey: "applicant.commitment_signed_at",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Commitment
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;
      const commitmentSigned = applicant.applicant?.commitment_signed_at;

      return (
        <div className="flex items-center justify-center px-3 py-2">
          {commitmentSigned ? (
            <div className="flex flex-col items-center gap-1">
              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Signed
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(commitmentSigned).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Not signed
            </span>
          )}
        </div>
      );
    },
    meta: {
      className: "w-32 text-center",
    },
  },
  {
    id: "reapply",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
        >
          Reapply
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center px-3 py-2">
          <ApplicantReapplyTime applicant={applicant} />
        </div>
      );
    },
    meta: {
      className: "w-28 text-center",
    },
    enableHiding: true,
  },
  {
    id: "actions",
    header: () => (
      <Button
        variant="ghost"
        className="flex h-10 items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        Actions
      </Button>
    ),
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center px-3 py-2">
          <ApplicantActionButton applicant={applicant} />
        </div>
      );
    },
    meta: {
      className: "w-20",
    },
  },
];
