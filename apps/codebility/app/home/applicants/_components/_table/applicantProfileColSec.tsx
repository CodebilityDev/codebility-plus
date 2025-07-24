"use client";

import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import DefaultAvatar from "@/components/DefaultAvatar";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs";
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
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {/* Mobile View */}
      <div className="flex w-full items-start justify-start gap-2 xl:hidden">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="mr-2 mt-8 dark:border-none dark:ring-1 dark:ring-white"
        />
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
            <AccordionTrigger className="flex w-full min-w-full pr-2 text-base hover:bg-muted/50 md:text-lg">
              <div className="flex w-full max-w-full items-center justify-start gap-3 ">
                <Avatar>
                  {applicant.image_url ? (
                    <AvatarImage src={applicant.image_url} />
                  ) : (
                    <DefaultAvatar size={40} />
                  )}
                </Avatar>
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <p className="text-sm capitalize">
                      {applicant.first_name} {applicant.last_name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {applicant.display_position || "Not specified"}
                  </p>
                  {applicant.years_of_experience !== undefined && (
                    <p className="text-xs text-gray-400">
                      {applicant.years_of_experience}{" "}
                      {applicant.years_of_experience === 1 ? "year" : "years"}{" "}
                      experience
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="m-0 p-0">
              <Table className="text-dark100_light900 m-0 p-0">
                <TableHeader>
                  {/* Email Row */}
                  <TableRow className="m-0 grid grid-cols-2 p-2">
                    <TableCell className="text-sm">Email</TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          {/*  <Link
                              href={createGmailLink(applicant.email_address)}
                              target="_blank"
                            >
                              <IconEmail className="h-[18px] w-[18px] invert dark:invert-0" />
                            </Link> */}
                          <span className="max-w-[150px] truncate text-xs">
                            {applicant.email_address}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* GitHub Row */}
                  <TableRow className="grid grid-cols-2 p-2">
                    <TableCell className="text-sm">Github</TableCell>
                    <TableCell>
                      {applicant.github ? (
                        <Link href={applicant.github} target="_blank">
                          <IconGithub className="h-[18px] w-[18px] invert dark:invert-0" />
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Portfolio Row */}
                  <TableRow className="grid grid-cols-2 p-2">
                    <TableCell className="text-sm">Portfolio</TableCell>
                    <TableCell>
                      {applicant.portfolio_website ? (
                        <Link
                          href={applicant.portfolio_website}
                          target="_blank"
                        >
                          <IconLink className="h-[18px] w-[18px] invert dark:invert-0" />
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-500">None</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Tech Stack Row */}
                  <TableRow className="grid grid-cols-2 p-2">
                    <TableCell className="text-sm">Tech Stack</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {applicant.tech_stacks &&
                        applicant.tech_stacks.length > 0 &&
                        !applicant.tech_stacks.includes("none") ? (
                          applicant.tech_stacks.map((stack, i) => (
                            <Image
                              key={i}
                              src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                              alt={`${stack} icon`}
                              width={25}
                              height={25}
                              title={stack}
                              className="h-[25px] w-[25px] transition duration-300 hover:-translate-y-0.5"
                            />
                          ))
                        ) : (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Date Applied Row */}
                  <TableRow className="grid grid-cols-2 p-2">
                    <TableCell className="text-sm">Date Applied</TableCell>
                    <TableCell>
                      {" "}
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="max-w-[150px] truncate text-xs">
                            {applicant.date_applied
                              ? new Date(
                                  applicant.date_applied,
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Test Taken Row */}
                  {applicant.application_status === "testing" && (
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Test Taken</TableCell>
                      <TableCell>
                        {" "}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="max-w-[150px] truncate text-xs">
                              {applicant.applicant?.test_taken
                                ? new Date(
                                    applicant.applicant.test_taken,
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Time Row */}
                  {applicant.application_status === "testing" && (
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Time</TableCell>
                      <TableCell>
                        {" "}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="max-w-[150px] truncate text-xs">
                              <>
                                <ApplicantTestTimeRemaining
                                  applicant={applicant}
                                  isMobile={true}
                                />
                              </>
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Fork URL Row */}
                  {applicant.application_status === "testing" && (
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Fork URL</TableCell>
                      <TableCell>
                        {" "}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="max-w-[150px] truncate text-xs">
                              {applicant.applicant?.fork_url ? (
                                <Link
                                  href={applicant.applicant.fork_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <IconLink className="h-4 w-4 text-gray-200" />
                                </Link>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  N/A
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* Reapply Row */}
                  {applicant.application_status === "denied" && (
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Reapply</TableCell>
                      <TableCell>
                        {" "}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="max-w-[150px] truncate text-xs">
                              <ApplicantReapplyTime
                                applicant={applicant}
                                isMobile={true}
                              />
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow className="grid grid-cols-2 p-2">
                    <TableCell className="text-sm">Actions</TableCell>

                    <TableCell>
                      <ApplicantActionButton applicant={applicant} />
                    </TableCell>
                  </TableRow>
                </TableHeader>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

memo(ApplicantProfileColSec);
