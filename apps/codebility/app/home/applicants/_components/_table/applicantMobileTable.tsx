"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/components/DefaultAvatar";
import { IconGithub, IconLink } from "@/public/assets/svgs";
import { cn } from "@/lib/utils";
import {
  Table as TableInstance,
} from "@tanstack/react-table";

import { NewApplicantType } from "../../_service/types";
import ApplicantRowActionButton from "./applicantRowActionButton";
import ApplicantTestTimeRemaining from "../applicantTestTimeRemaining";
import ApplicantActionButton from "./applicantActionButton";

function ApplicantMobileTableComponent<TData extends NewApplicantType>({
  table,
}: {
  table: TableInstance<TData>;
}) {
  return (
    <>
      {/* Mobile card layout for smaller screens */}
      <div className="block xl:hidden">
        {/* Sleek cards for each applicant */}
        <div className="space-y-1">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const applicant = row.original;
              return (
                <div
                  key={`${row.id}-${row.index}`}
                  className={cn(
                    "rounded-md border bg-slate-100 p-2 shadow-sm transition-all hover:shadow-md dark:bg-slate-800 dark:border-slate-600",
                    applicant.application_status === "testing" &&
                      applicant.applicant?.fork_url &&
                      "bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700",
                    applicant.application_status === "onboarding" &&
                      "bg-customBlue-50 border-customBlue-300 dark:bg-customBlue-900/20 dark:border-customBlue-700",
                    applicant.application_status === "denied" &&
                      "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700",
                  )}
                >
                  {/* Header with checkbox, avatar, name, and action */}
                  <div className="mb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        onClick={() => row.toggleSelected(!row.getIsSelected())}
                        className={cn(
                          "h-5 w-5 rounded border-2 cursor-pointer transition-all flex items-center justify-center",
                          row.getIsSelected()
                            ? "bg-blue-500 border-blue-500"
                            : "bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-500"
                        )}
                      >
                        {row.getIsSelected() && (
                          <span className="text-white text-sm font-bold">✓</span>
                        )}
                      </div>
                      <div className="h-7 w-7 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        {applicant.image_url ? (
                          <Image
                            src={applicant.image_url}
                            alt={`${applicant.first_name} avatar`}
                            width={28}
                            height={28}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar size={28} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-xs font-semibold text-gray-900 dark:text-gray-100">
                          {applicant.first_name.charAt(0).toUpperCase() + applicant.first_name.slice(1)} {" "}
                          {applicant.last_name.charAt(0).toUpperCase() + applicant.last_name.slice(1)}
                        </h3>
                        <p className="truncate text-[11px] text-gray-600 dark:text-gray-400">
                          {applicant.email_address}
                        </p>
                      </div>
                    </div>
                    <ApplicantActionButton applicant={applicant} />
                  </div>

                  {/* Compact info grid */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                    {/* Left column */}
                    <div className="space-y-1">
                      {/* Position */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] opacity-60">💼</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {applicant.display_position || "Not specified"}
                        </span>
                      </div>
                      {/* Experience */}
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] opacity-60">⏱</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {applicant.years_of_experience !== undefined
                            ? `${applicant.years_of_experience} years`
                            : "No exp"}
                        </span>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-1 text-right">
                      {/* Applied date */}
                      <div className="text-gray-600 dark:text-gray-400">
                        <span className="text-[10px] opacity-60">📅 </span>
                        {applicant.date_applied
                          ? new Date(applicant.date_applied).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: '2-digit'
                            })
                          : "N/A"}
                      </div>
                      {/* Links and test status */}
                      <div className="flex items-center justify-end gap-1.5">
                        {applicant.application_status !== "testing" && applicant.github && (
                          <Link
                            href={applicant.github}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <IconGithub className="h-3 w-3" />
                          </Link>
                        )}
                        {applicant.application_status !== "testing" && applicant.portfolio_website && (
                          <Link
                            href={applicant.portfolio_website}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <IconLink className="h-3 w-3" />
                          </Link>
                        )}
                        {applicant.application_status === "testing" && (
                          <>
                            <ApplicantTestTimeRemaining applicant={applicant} />
                            {applicant.applicant?.fork_url && (
                              <Link
                                href={applicant.applicant.fork_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-customBlue-600 hover:text-customBlue-800 dark:text-customBlue-400 dark:hover:text-customBlue-300"
                              >
                                <IconLink className="h-2.5 w-2.5" />
                              </Link>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Tech stacks - only show if not in testing status */}
                  {applicant.application_status !== "testing" && applicant.tech_stacks && applicant.tech_stacks.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 overflow-hidden">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">💻</span>
                      <div className="flex gap-0.5 overflow-x-auto">
                        {applicant.tech_stacks.slice(0, 4).map((stack) => (
                          <span
                            key={stack}
                            className="rounded bg-gray-100 px-1 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          >
                            {stack}
                          </span>
                        ))}
                        {applicant.tech_stacks.length > 4 && (
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            +{applicant.tech_stacks.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-md border bg-white p-3 text-center dark:bg-gray-900 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">No results found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(ApplicantMobileTableComponent) as typeof ApplicantMobileTableComponent;
