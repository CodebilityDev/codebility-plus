"use client";

import React from "react";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import {
  CheckCircle2Icon,
  Loader2Icon,
  MoreHorizontalIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import {
  acceptApplicantAction,
  deleteApplicantAction,
  denyApplicantAction,
  moveApplicantToApplyingAction,
  moveApplicantToOnboardingAction,
  moveApplicantToTestingAction,
  passApplicantTestAction,
} from "../../_service/action";
import { NewApplicantType } from "../../_service/types";

export default function ApplicantActionButton({
  applicant,
}: {
  applicant: NewApplicantType;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [dialogState, setDialogState] = React.useState<
    | "applying"
    | "testing"
    | "onboarding"
    | "denied"
    | "delete"
    | "pass"
    | "fail"
    | "accept"
    | "deny"
    | null
  >(null);

  const handleMoveToApplying = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToApplyingAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error moving applicant to applying:", error);
    }
    setIsLoading(false);
  };

  const handleMoveToTesting = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToTestingAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error moving applicant to Testing:", error);
    }
    setIsLoading(false);
  };

  const handleMoveToOnboarding = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToOnboardingAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error moving applicant to onboarding:", error);
    }
    setIsLoading(false);
  };

  const handleMoveToDenied = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error moving applicant to denied:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteApplicant = async () => {
    setIsLoading(true);
    try {
      await deleteApplicantAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error deleting applicant:", error);
    }
    setIsLoading(false);
  };

  const handlePassApplicant = async () => {
    setIsLoading(true);
    try {
      await passApplicantTestAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error passing all applicants:", error);
    }
    setIsLoading(false);
  };

  const handleFailApplicant = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error failing all applicants:", error);
    }
    setIsLoading(false);
  };

  const handleAcceptApplicant = async () => {
    setIsLoading(true);
    try {
      await acceptApplicantAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error accepting all applicants:", error);
    }
    setIsLoading(false);
  };

  const handleDenyApplicant = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      setIsOpen(false);
    } catch (error) {
      console.error("Error denying all applicants:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      {applicant.application_status === "testing" && (
        <div className="flex items-center gap-3">
          <Button
            className="h-fit py-1 lg:text-base"
            onClick={() => {
              setDialogState("pass");
              setIsOpen(true);
            }}
          >
            Pass
          </Button>
          <Button
            variant={"destructive"}
            className="h-fit py-1 lg:text-base"
            onClick={() => {
              setDialogState("fail");
              setIsOpen(true);
            }}
          >
            Fail
          </Button>
        </div>
      )}

      {applicant.application_status === "onboarding" && (
        <div className="flex items-center gap-3">
          <Button
            className="h-fit py-1 lg:text-base"
            onClick={() => {
              setDialogState("accept");
              setIsOpen(true);
            }}
          >
            Accept
          </Button>
          <Button
            variant={"destructive"}
            className="h-fit py-1 lg:text-base"
            onClick={() => {
              setDialogState("deny");
              setIsOpen(true);
            }}
          >
            Deny
          </Button>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("applying");
                  setIsOpen(true);
                }}
              >
                Move to Applying
              </DropdownMenuItem>
            )}

            {applicant.application_status !== "testing" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("testing");
                  setIsOpen(true);
                }}
              >
                Move to Testing
              </DropdownMenuItem>
            )}

            {applicant.application_status !== "onboarding" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("onboarding");
                  setIsOpen(true);
                }}
              >
                Move to Onboarding
              </DropdownMenuItem>
            )}

            {applicant.application_status !== "denied" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("denied");
                  setIsOpen(true);
                }}
              >
                Move to Denied
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            {/* deleting applicant actions */}
            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={() => {
                setDialogState("delete");
                setIsOpen(true);
              }}
            >
              Delete Applicant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {dialogState === "applying" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Move to Applying</DialogTitle>
              <DialogDescription>
                Are you sure you want to move this applicant to applying?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleMoveToApplying} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "testing" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Move to Testing</DialogTitle>
              <DialogDescription>
                Are you sure you want to move this applicant to Testing?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleMoveToTesting} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "onboarding" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Move to onboarding</DialogTitle>
              <DialogDescription>
                Are you sure you want to move this applicant to onboarding?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleMoveToOnboarding} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "denied" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Move to denied</DialogTitle>
              <DialogDescription>
                Are you sure you want to move this applicant to denied?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleMoveToDenied} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "delete" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Applicant</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this applicant?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDeleteApplicant}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "pass" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Pass Assessment</DialogTitle>
              <DialogDescription>
                This will move the applicant to the onboarding phase. Has this
                applicant completed the assessment successfully?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handlePassApplicant} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "fail" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Fail Applicant</DialogTitle>
              <DialogDescription>
                This will mark the applicant as rejected for failing the
                assessment. This increases their rejection count. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleFailApplicant}
                disabled={isLoading}
                variant={"destructive"}
              >
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "accept" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Accept Applicant</DialogTitle>
              <DialogDescription>
                This will approve the applicant and mark them as an official
                CODEV member. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAcceptApplicant} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Accept
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "deny" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Deny Applicant</DialogTitle>
              <DialogDescription>
                This will deny the applicant's current application, but they can
                reapply after 3 months. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleDenyApplicant}
                disabled={isLoading}
                variant={"destructive"}
              >
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Deny
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
