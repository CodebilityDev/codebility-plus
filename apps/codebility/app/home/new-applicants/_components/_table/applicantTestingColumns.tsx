"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTestDate } from "@/app/applicant/waiting/_service/util";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import { IconLink } from "@/public/assets/svgs";
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
import ApplicantProfileColSec from "./applicantProfileColSec";

export const applicantsTestingColumns: ColumnDef<NewApplicantType>[] = [
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
          <ApplicantProfileColSec applicant={applicant} row={row}/>
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
        <div className="py-3 text-sm text-gray-300">
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
        <div className="py-3 text-center text-sm text-gray-300">
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
    accessorKey: "date_applied",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-200"
        >
          Applied
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
    accessorKey: "applicant.test_taken",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-200"
        >
          Test Taken
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="py-3 text-center text-sm text-gray-300">
          {applicant.applicant?.test_taken
            ? new Date(applicant.applicant.test_taken).toLocaleDateString()
            : "N/A"}
        </div>
      );
    },
    meta: {
      className: "m-0 px-0",
    },
  },
  {
    id: "test_time_remaining",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center gap-2 text-sm font-medium text-gray-200"
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const applicant = row.original;
      const applicantData = applicant.applicant;

      const reapplyDate = useMemo(
        () =>
          getTestDate(new Date(applicantData?.test_taken || "") || new Date()),
        [applicantData?.test_taken],
      );

      const [timeLeft, setTimeLeft] = useState(() => {
        const now = new Date();
        const difference = reapplyDate.getTime() - now.getTime();
        const isExpired = difference <= 0;

        if (isExpired) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { days, hours, minutes, seconds, isExpired };
      });

      useEffect(() => {
        const interval = setInterval(() => {
          const now = new Date();
          const difference = reapplyDate.getTime() - now.getTime();

          if (difference <= 0) {
            setTimeLeft({
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
              isExpired: true,
            });
            clearInterval(interval);
            return;
          }

          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
        }, 1000);

        return () => clearInterval(interval);
      }, [reapplyDate]);

      return (
        <div className="py-3 text-center text-sm text-gray-300">
          {!timeLeft.isExpired ? (
            <>
              {timeLeft.days > 0 && (
                <span>{`${timeLeft.days}d ${timeLeft.hours}h`}</span>
              )}
              {timeLeft.hours === 0 && timeLeft.minutes > 0 && (
                <span>{`${timeLeft.minutes}m`}</span>
              )}
              {timeLeft.minutes === 0 && timeLeft.seconds > 0 && (
                <span>{`${timeLeft.seconds}s`}</span>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">Expired</span>
          )}
        </div>
      );
    },
    meta: {
      className: "m-0 px-0",
    },
  },
  {
    accessorKey: "applicant.fork_url",
    header: "Fork URL",
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center px-3 py-3 text-center">
          {applicant.applicant?.fork_url ? (
            <Link
              href={applicant.applicant.fork_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconLink className="h-4 w-4 text-gray-200" />
            </Link>
          ) : (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const applicant = row.original;

      return (
        <div className="flex items-center justify-center gap-2 px-3 py-3">
          <ApplicantActionButton applicant={applicant} />
        </div>
      );
    },
  },
];
