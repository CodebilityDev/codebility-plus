import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ApplicantsActionButtons from "@/app/home/applicants/_components/ApplicantsActionButtons";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import { CheckCircle } from "lucide-react";

import { Avatar, AvatarImage } from "@codevs/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@codevs/ui/hover-card";

import { createAssessmentEmailLink } from "./email-templates";

const ApplicantsTableDesktop = ({
  applicants,
  trackAssessmentSent,
  sentAssessments,
}: {
  applicants: Codev[];
  trackAssessmentSent?: (applicantId: string) => void;
  sentAssessments?: Record<string, boolean>;
}) => {
  // Helper function to create Google Mail link
  const createGmailLink = (email: string) => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
  };

  // Handle when an assessment is sent
  const handleAssessmentSent = (applicantId: string, role: string) => {
    if (trackAssessmentSent) {
      trackAssessmentSent(applicantId);
    }
  };

  // Check if assessment has been sent
  const hasAssessmentBeenSent = (applicantId: string) => {
    return sentAssessments ? !!sentAssessments[applicantId] : false;
  };

  return (
    <Table className="border-collapse">
      <TableHeader>
        <TableRow className="border-b border-gray-800">
          <TableHead className="w-2/12 px-3 py-3 text-left text-sm font-medium text-gray-300">
            Applicant
          </TableHead>
          <TableHead className="w-1/12 px-3 py-3 text-left text-sm font-medium text-gray-300">
            Position
          </TableHead>
          <TableHead className="w-1/12 px-3 py-3 text-center text-sm font-medium text-gray-300">
            Exp
          </TableHead>
          <TableHead className="w-1/12 px-3 py-3 text-center text-sm font-medium text-gray-300">
            Github
          </TableHead>
          <TableHead className="w-1/12 px-3 py-3 text-center text-sm font-medium text-gray-300">
            Portfolio
          </TableHead>
          <TableHead className="w-2/12 px-3 py-3 text-center text-sm font-medium text-gray-300">
            Tech Stack
          </TableHead>
          <TableHead className="w-2/12 px-3 py-3 text-center text-sm font-medium text-gray-300">
            Email
          </TableHead>
          <TableHead className="w-1/12 px-3 py-3 text-center text-sm font-medium text-gray-300">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applicants.length > 0 ? (
          applicants.map((applicant) => (
            <TableRow
              key={applicant.id}
              className="border-b border-gray-800 hover:bg-gray-900/50"
            >
              <TableCell className="px-3 py-3">
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
                        {hasAssessmentBeenSent(applicant.id) && (
                          <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Assessment sent</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell className="px-3 py-3 text-sm text-gray-300">
                {applicant.display_position || "Not specified"}
              </TableCell>
              <TableCell className="px-3 py-3 text-center text-sm text-gray-300">
                {applicant.years_of_experience !== undefined
                  ? `${applicant.years_of_experience} ${
                      applicant.years_of_experience === 1 ? "yr" : "yrs"
                    }`
                  : "N/A"}
              </TableCell>
              <TableCell className="px-3 py-3">
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
              </TableCell>
              <TableCell className="px-3 py-3">
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
              </TableCell>
              <TableCell className="px-3 py-3">
                <div className="flex flex-wrap justify-center gap-2">
                  {applicant.tech_stacks?.length > 0 ? (
                    applicant.tech_stacks.map((stack) => (
                      <Image
                        key={stack}
                        src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                        alt={stack}
                        width={22}
                        height={22}
                        className="h-6 w-6"
                      />
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">None</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-3 py-3">
                <div className="flex flex-col items-center gap-1">
                  <Link
                    href={createGmailLink(applicant.email_address)}
                    target="_blank"
                    className="text-gray-400 hover:text-gray-200"
                    title="Send email"
                  >
                    <IconEmail className="h-5 w-5 invert dark:invert-0" />
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`h-6 border-gray-700 bg-transparent px-2 py-0 text-xs ${
                          hasAssessmentBeenSent(applicant.id)
                            ? "border-green-700 text-green-400"
                            : "text-gray-300"
                        }`}
                      >
                        {hasAssessmentBeenSent(applicant.id) ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>Sent</span>
                          </div>
                        ) : (
                          "Send Assessment"
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 border border-gray-700 bg-gray-900">
                      <DropdownMenuItem asChild>
                        <Link
                          href={createAssessmentEmailLink(
                            applicant.email_address,
                            applicant.first_name,
                            applicant.last_name,
                            applicant.display_position,
                            applicant.years_of_experience,
                            "frontend",
                          )}
                          target="_blank"
                          className="cursor-pointer text-gray-200 hover:text-white"
                          onClick={() =>
                            handleAssessmentSent(applicant.id, "frontend")
                          }
                        >
                          Frontend Assessment
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={createAssessmentEmailLink(
                            applicant.email_address,
                            applicant.first_name,
                            applicant.last_name,
                            applicant.display_position,
                            applicant.years_of_experience,
                            "backend",
                          )}
                          target="_blank"
                          className="cursor-pointer text-gray-200 hover:text-white"
                          onClick={() =>
                            handleAssessmentSent(applicant.id, "backend")
                          }
                        >
                          Backend Assessment
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={createAssessmentEmailLink(
                            applicant.email_address,
                            applicant.first_name,
                            applicant.last_name,
                            applicant.display_position,
                            applicant.years_of_experience,
                            "mobile",
                          )}
                          target="_blank"
                          className="cursor-pointer text-gray-200 hover:text-white"
                          onClick={() =>
                            handleAssessmentSent(applicant.id, "mobile")
                          }
                        >
                          Mobile Assessment
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={createAssessmentEmailLink(
                            applicant.email_address,
                            applicant.first_name,
                            applicant.last_name,
                            applicant.display_position,
                            applicant.years_of_experience,
                            "designer",
                          )}
                          target="_blank"
                          className="cursor-pointer text-gray-200 hover:text-white"
                          onClick={() =>
                            handleAssessmentSent(applicant.id, "designer")
                          }
                        >
                          Designer Assessment
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
              <TableCell className="px-3 py-3 text-center">
                <ApplicantsActionButtons applicant={applicant} />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="py-4 text-center text-gray-400">
              No applicants found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default ApplicantsTableDesktop;
