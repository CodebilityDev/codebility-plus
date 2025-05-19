"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/Components/ui/button";
import { IconGithub, IconLink } from "@/public/assets/svgs";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Checkbox } from "@codevs/ui/checkbox";

import { NewApplicantType } from "../../_service/types";
import ApplicantActionButton from "./applicantActionButton";
import ApplicantProfileColSec from "./applicantProfileColSec";

export const applicantsColumns: ColumnDef<NewApplicantType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="dark:border-none dark:ring-1 dark:ring-white"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mx-0 mt-8 px-0 dark:border-none dark:ring-1 dark:ring-white xl:mt-2"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "applicant",
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start gap-2 text-sm font-medium text-gray-200"
        >
          Applicant
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
          className="flex items-center justify-start gap-2 text-sm font-medium text-gray-200"
        >
          Position
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="px-3 py-3 text-sm text-gray-300">
          {applicant.display_position || "Not specified"}
        </div>
      );
    },
  },
  {
    accessorKey: "years_of_experience",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-200"
        >
          Exp
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="px-3 py-3 text-center text-sm text-gray-300">
          {applicant.years_of_experience !== undefined
            ? `${applicant.years_of_experience} ${
                applicant.years_of_experience === 1 ? "yr" : "yrs"
              }`
            : "N/A"}
        </div>
      );
    },
    meta: {
      className: "m-0 px-0",
    },
  },
  {
    accessorKey: "github",
    header: "GitHub",
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="px-3 py-3">
          <div className="flex justify-center">
            {applicant.github ? (
              <Link
                href={applicant.github}
                target="_blank"
                className="text-gray-400 hover:text-gray-200"
              >
                <IconGithub className="h-5 w-5 invert dark:invert-0" />
              </Link>
            ) : (
              <span className="text-sm text-gray-500">None</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "portfolio_website",
    header: "Portfolio",
    cell: ({ row }) => {
      const applicant = row.original;

      if (applicant.application_status === "testing") {
        return null;
      }

      return (
        <div className="px-3 py-3">
          <div className="flex justify-center">
            {applicant.portfolio_website ? (
              <Link
                href={applicant.portfolio_website}
                target="_blank"
                className="text-gray-400 hover:text-gray-200"
              >
                <IconLink className="h-5 w-5 invert dark:invert-0" />
              </Link>
            ) : (
              <span className="text-sm text-gray-500">None</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "tech_stacks",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-start gap-2 text-sm font-medium text-gray-200"
        >
          Tech Stacks
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
      const [showAll, setShowAll] = React.useState(false);

      const displayStacks = showAll
        ? applicant.tech_stacks
        : applicant.tech_stacks?.slice(0, 5);

      const hasMoreStacks = applicant.tech_stacks?.length > 5;

      return (
        <div className="px-3 py-3 text-sm">
          <div className="flex w-40 flex-wrap justify-center gap-2 text-sm">
            {applicant.tech_stacks?.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-sm">
                {displayStacks.map((stack) => (
                  <Image
                    key={stack}
                    src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                    alt={stack}
                    width={22}
                    height={22}
                    className="h-6 w-6"
                  />
                ))}
                {hasMoreStacks && (
                  <button
                    /*  variant="ghost" */
                    onClick={() => setShowAll(!showAll)}
                    className="text-sm text-gray-400 hover:text-gray-200"
                  >
                    {showAll
                      ? "Show less"
                      : `+${applicant.tech_stacks.length - 5} more`}
                  </button>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500">None</span>
            )}
          </div>
        </div>
      );
    },
    meta: {
      className: "m-0 px-0",
    },
  },
  {
    accessorKey: "date_applied",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-200"
        >
          Date Applied
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="py-3 text-center text-sm text-gray-300">
          {applicant.date_applied
            ? new Date(applicant.date_applied).toLocaleDateString()
            : "N/A"}
        </div>
      );
    },
    meta: {
      className: "m-0 px-0",
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-start gap-2 px-3 py-3">
          <ApplicantActionButton applicant={applicant} />
        </div>
      );
    },
  },
];
