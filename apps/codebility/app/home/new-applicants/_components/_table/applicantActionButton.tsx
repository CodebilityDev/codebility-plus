import React from "react";
import { Button } from "@/Components/ui/button";
import ghost from "@material-tailwind/react/theme/components/timeline/timelineIconColors/ghost";
import { MoreHorizontalIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { NewApplicantType } from "../../_service/types";

export default function ApplicantActionButton({
  applicant,
}: {
  applicant: NewApplicantType;
}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
          >
            <span className="sr-only">More actions</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="dark:bg-dark-200 min-w-[160px] bg-white"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/* viewing/editing applicant actions */}
          <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
            Edit Applicant
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {/* moving applicant actions */}
          {applicant.application_status !== "applying" && (
            <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
              Move to Applying
            </DropdownMenuItem>
          )}

          {applicant.application_status !== "testing" && (
            <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
              Move to Testing
            </DropdownMenuItem>
          )}

          {applicant.application_status !== "onboarding" && (
            <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
              Move to Onboarding
            </DropdownMenuItem>
          )}

          {applicant.application_status !== "denied" && (
            <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
              Move to Denied
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          {/* deleting applicant actions */}
          <DropdownMenuItem className="cursor-pointer text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
