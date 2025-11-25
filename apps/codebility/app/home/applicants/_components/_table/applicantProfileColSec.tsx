"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { IconEmail, IconFacebook, IconGithub, IconLink } from "@/public/assets/svgs";
import { Row } from "@tanstack/react-table";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@codevs/ui/accordion";
import { Avatar, AvatarImage } from "@codevs/ui/avatar";
import { Checkbox } from "@codevs/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

import { NewApplicantType } from "../../_service/types";
import ApplicantReapplyTime from "../applicantReapplyTime";
import ApplicantTestTimeRemaining from "../applicantTestTimeRemaining";
import ApplicantActionButton from "./applicantActionButton";

export default function ApplicantProfileColSec({
  applicant,
  row,
}: {
  applicant: NewApplicantType;
  row: Row<NewApplicantType>;
}) {
  return (
    <div className="w-full min-w-full">
      {/* Desktop View */}
      <div className="hidden xl:block">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-10 w-10 ring-2 ring-gray-100 dark:ring-gray-800">
                {applicant.image_url ? (
                  <AvatarImage src={applicant.image_url} />
                ) : (
                  <DefaultAvatar size={40} />
                )}
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <p className="cursor-pointer truncate text-sm font-semibold text-gray-900 hover:underline dark:text-gray-100">
                  {applicant.first_name.charAt(0).toUpperCase() +
                    applicant.first_name.slice(1)}{" "}
                  {applicant.last_name.charAt(0).toUpperCase() +
                    applicant.last_name.slice(1)}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {applicant.email_address}
                </p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="background-box w-80 border border-gray-200 p-4 shadow-lg dark:border-gray-700">
            <div className="flex gap-4">
              {applicant.image_url ? (
                <Image
                  src={applicant.image_url}
                  alt={`${applicant.first_name} avatar`}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              ) : (
                <DefaultAvatar size={80} className="rounded-lg" />
              )}
              <div className="text-gray-700 dark:text-gray-200">
                <h4 className="text-base font-semibold">
                  {applicant.first_name.charAt(0).toUpperCase() +
                    applicant.first_name.slice(1)}{" "}
                  {applicant.last_name.charAt(0).toUpperCase() +
                    applicant.last_name.slice(1)}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {applicant.email_address}
                </p>
                {applicant.display_position && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {applicant.display_position}
                  </p>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Mobile View */}
      <div className="flex w-full items-start justify-start gap-2 xl:hidden">
        <Accordion
          key={applicant.id}
          type="single"
          collapsible
          className="w-full"
        >
          <AccordionItem
            value={applicant.last_name}
            className="w-full min-w-full border-b-0"
          >
            <AccordionTrigger className="flex w-full min-w-full rounded-lg px-4 py-3 text-base transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 md:text-lg">
              <div className="flex w-full max-w-full items-center justify-start gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800">
                  {applicant.image_url ? (
                    <AvatarImage src={applicant.image_url} />
                  ) : (
                    <DefaultAvatar size={48} />
                  )}
                </Avatar>
                <div className="flex min-w-0 flex-col items-start">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold capitalize text-gray-900 dark:text-gray-100">
                      {applicant.first_name} {applicant.last_name}
                    </p>
                  </div>
                  <p className="truncate text-xs text-gray-600 dark:text-gray-400">
                    {applicant.display_position || "Not specified"}
                  </p>
                  {applicant.years_of_experience !== undefined && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {applicant.years_of_experience}{" "}
                      {applicant.years_of_experience === 1 ? "year" : "years"}{" "}
                      experience
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="m-0 p-0">
              <div className="space-y-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                {/* Email Row */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</span>
                  <span className="max-w-[180px] truncate text-sm text-gray-900 dark:text-gray-100">
                    {applicant.email_address}
                  </span>
                </div>

                {/* GitHub Row */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                  <div>
                    {applicant.github ? (
                      <Link href={applicant.github} target="_blank">
                        <IconGithub className="h-5 w-5 invert dark:invert-0" />
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        None
                      </span>
                    )}
                  </div>
                </div>

                {/* Facebook Row */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                  <div>
                    {applicant.facebook ? (
                      <Link href={applicant.facebook} target="_blank">
                        <IconFacebook className="h-5 w-5 invert dark:invert-0" />
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        None
                      </span>
                    )}
                  </div>
                </div>

                {/* Portfolio Row */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio</span>
                  <div>
                    {applicant.portfolio_website ? (
                      <Link
                        href={applicant.portfolio_website}
                        target="_blank"
                      >
                        <IconLink className="h-5 w-5 invert dark:invert-0" />
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        None
                      </span>
                    )}
                  </div>
                </div>

                {/* Tech Stack Row */}
                <div className="flex items-start justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tech Stack</span>
                  <div className="flex max-w-[200px] flex-wrap justify-end gap-1">
                    {applicant.tech_stacks &&
                    applicant.tech_stacks.length > 0 &&
                    !applicant.tech_stacks.includes("none") ? (
                      applicant.tech_stacks.slice(0, 4).map((stack, i) => (
                        <Image
                          key={i}
                          src={`/assets/svgs/techstack/icon-${stack.toLowerCase()}.svg`}
                          alt={`${stack} icon`}
                          width={24}
                          height={24}
                          title={stack}
                          className="h-6 w-6 transition duration-300 hover:-translate-y-0.5"
                        />
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        None
                      </span>
                    )}
                  </div>
                </div>

                {/* Date Applied Row */}
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Applied</span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {applicant.date_applied
                      ? new Date(applicant.date_applied).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                {/* Conditional Rows */}
                {applicant.application_status === "testing" && (
                  <>
                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Taken</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {applicant.applicant?.test_taken
                          ? new Date(applicant.applicant.test_taken).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time</span>
                      <div className="text-sm">
                        <ApplicantTestTimeRemaining
                          applicant={applicant}
                          isMobile={true}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fork URL</span>
                      <div>
                        {applicant.applicant?.fork_url ? (
                          <Link
                            href={applicant.applicant.fork_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <IconLink className="h-5 w-5 text-gray-600 dark:text-gray-200" />
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            N/A
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {applicant.application_status === "denied" && (
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reapply</span>
                    <div className="text-sm">
                      <ApplicantReapplyTime
                        applicant={applicant}
                        isMobile={true}
                      />
                    </div>
                  </div>
                )}

                {applicant.application_status !== "denied" && (
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reminded</span>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                        {applicant.applicant?.reminded_count ?? 0}
                      </span>
                      {applicant.applicant?.last_reminded_date && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            applicant.applicant.last_reminded_date,
                          ).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actions</span>
                  <ApplicantActionButton applicant={applicant} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

memo(ApplicantProfileColSec);
