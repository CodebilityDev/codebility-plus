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
import ApplicantTechStack from "../applicantTechStack";
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
        <div className="space-y-1.5">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const applicant = row.original;
              return (
                <div
                  key={row.id}
                  className={cn(
                    "rounded-lg border bg-gray-50 p-2.5 shadow-sm dark:bg-gray-800",
                    applicant.application_status === "testing" &&
                      applicant.applicant?.fork_url &&
                      "bg-green-50 dark:bg-green-900/10",
                  )}
                >
                  {/* Header with avatar, name, and action */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        {applicant.image_url ? (
                          <Image
                            src={applicant.image_url}
                            alt={`${applicant.first_name} avatar`}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar size={32} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {applicant.first_name.charAt(0).toUpperCase() + applicant.first_name.slice(1)} {" "}
                          {applicant.last_name.charAt(0).toUpperCase() + applicant.last_name.slice(1)}
                        </h3>
                        <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                          {applicant.email_address}
                        </p>
                      </div>
                    </div>
                    <ApplicantActionButton applicant={applicant} />
                  </div>

                  {/* Compact single-row info */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {/* Position */}
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">📋</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {applicant.display_position || "Not specified"}
                        </span>
                      </div>

                      {/* Experience */}
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">⏱️</span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {applicant.years_of_experience !== undefined
                            ? `${applicant.years_of_experience}y`
                            : "N/A"}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-1">
                        {applicant.github && (
                          <Link
                            href={applicant.github}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <IconGithub className="h-3 w-3" />
                          </Link>
                        )}
                        {applicant.portfolio_website && (
                          <Link
                            href={applicant.portfolio_website}
                            target="_blank"
                            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                          >
                            <IconLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Applied date and test status */}
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-gray-600 dark:text-gray-400">
                        {applicant.date_applied
                          ? new Date(applicant.date_applied).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })
                          : "N/A"}
                      </span>
                      {applicant.application_status === "testing" && (
                        <div className="flex items-center gap-1">
                          <ApplicantTestTimeRemaining applicant={applicant} />
                          {applicant.applicant?.fork_url && (
                            <Link
                              href={applicant.applicant.fork_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <IconLink className="h-2.5 w-2.5" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tech stacks - ultra compact */}
                  {applicant.tech_stacks && applicant.tech_stacks.length > 0 && (
                    <div className="mt-1.5 border-t border-gray-200 pt-1.5 dark:border-gray-700">
                      <ApplicantTechStack applicant={applicant} />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-lg border bg-gray-50 p-4 text-center dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">No results found.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default memo(ApplicantMobileTableComponent) as typeof ApplicantMobileTableComponent;
