"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTestDate } from "@/app/applicant/waiting/_service/util";
import ApplicantStatusButtons from "@/app/home/applicants/_components/ApplicantsStatusButtons";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import { IconGithub, IconLink } from "@/public/assets/svgs";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Avatar, AvatarImage } from "@codevs/ui/avatar";
import { Checkbox } from "@codevs/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

import { NewApplicantType } from "../../_service/types";
import ApplicantActionButton from "./applicantActionButton";

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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-start gap-2">
                <Avatar className="mt-1 h-8 w-8">
                  {applicant.image_url ? (
                    <AvatarImage src={applicant.image_url} />
                  ) : (
                    <DefaultAvatar size={32} />
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <p className="cursor-pointer text-sm font-medium text-gray-200 hover:underline">
                    {applicant.first_name.charAt(0).toUpperCase() +
                      applicant.first_name.slice(1)}{" "}
                    {applicant.last_name.charAt(0).toUpperCase() +
                      applicant.last_name.slice(1)}
                  </p>
                  <p className="max-w-[170px] truncate text-xs text-gray-400">
                    {applicant.email_address}
                  </p>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="background-box w-80 border border-gray-700 p-4 shadow-lg">
              <div className="flex gap-4">
                {applicant.image_url ? (
                  <Image
                    src={applicant.image_url}
                    alt={`${applicant.first_name} avatar`}
                    width={80}
                    height={80}
                    className="rounded-md"
                  />
                ) : (
                  <DefaultAvatar size={80} className="rounded-md" />
                )}
                <div className="text-gray-200">
                  <h4 className="text-base font-medium">
                    {applicant.first_name.charAt(0).toUpperCase() +
                      applicant.first_name.slice(1)}{" "}
                    {applicant.last_name.charAt(0).toUpperCase() +
                      applicant.last_name.slice(1)}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {applicant.email_address}
                  </p>
                  {applicant.display_position && (
                    <p className="text-sm text-gray-400">
                      {applicant.display_position}
                    </p>
                  )}
                  {/* {hasAssessmentBeenSent(applicant.id) && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Assessment sent</span>
                    </div>
                  )} */}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
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
          {row.original.application_status === "onboarding" && (
            <div className="flex w-full items-center justify-center gap-2">
              <Button>Accept</Button>

              <Button variant={"destructive"}>Deny</Button>
            </div>
          )}

          <ApplicantActionButton applicant={applicant} />
        </div>
      );
    },
  },
];
