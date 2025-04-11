import Image from "next/image";
import Link from "next/link";
import ApplicantsActionButtons from "@/app/home/applicants/_components/ApplicantsActionButtons";
import DefaultAvatar from "@/Components/DefaultAvatar";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { IconEmail, IconGithub, IconLink } from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";
import { CheckCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@codevs/ui/accordion";
import { Avatar, AvatarImage } from "@codevs/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { createAssessmentEmailLink } from "./email-templates";

const ApplicantsTableMobile = ({
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
    <>
      {applicants.length > 0 ? (
        applicants.map((applicant) => (
          <Accordion
            key={applicant.id}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem
              value={applicant.last_name}
              className="border-zinc-300 dark:border-zinc-800"
            >
              <AccordionTrigger className="flex p-4 text-base hover:bg-muted/50 md:text-lg">
                <div className="flex items-center justify-start gap-3 md:w-full">
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
                      {hasAssessmentBeenSent(applicant.id) && (
                        <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                      )}
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
              <AccordionContent className="p-4">
                <Table className="text-dark100_light900">
                  <TableHeader>
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Email</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center gap-2">
                            <Link
                              href={createGmailLink(applicant.email_address)}
                              target="_blank"
                            >
                              <IconEmail className="h-[18px] w-[18px] invert dark:invert-0" />
                            </Link>
                            <span className="max-w-[150px] truncate text-xs">
                              {applicant.email_address}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`h-7 w-full border-gray-700 bg-transparent text-xs ${
                                  hasAssessmentBeenSent(applicant.id)
                                    ? "border-green-700 text-green-400"
                                    : "text-gray-300"
                                }`}
                              >
                                {hasAssessmentBeenSent(applicant.id) ? (
                                  <div className="flex items-center justify-center gap-1">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    <span>Assessment Sent</span>
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
                                    handleAssessmentSent(
                                      applicant.id,
                                      "frontend",
                                    )
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
                                    handleAssessmentSent(
                                      applicant.id,
                                      "backend",
                                    )
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
                                    handleAssessmentSent(
                                      applicant.id,
                                      "designer",
                                    )
                                  }
                                >
                                  Designer Assessment
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
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
                    <TableRow className="grid grid-cols-2 p-2">
                      <TableCell className="text-sm">Tech Stack</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {applicant.tech_stacks &&
                          applicant.tech_stacks.length > 0 ? (
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
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <ApplicantsActionButtons applicant={applicant} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))
      ) : (
        <div className="p-4 text-center text-gray-400">
          No applicants found.
        </div>
      )}
    </>
  );
};

export default ApplicantsTableMobile;
