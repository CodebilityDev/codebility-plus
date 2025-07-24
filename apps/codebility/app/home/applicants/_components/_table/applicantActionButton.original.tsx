"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { dialog } from "@material-tailwind/react";
import { set } from "date-fns";
import {
  CheckCircle2Icon,
  Loader2Icon,
  MailIcon,
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
import {
  sendDenyEmail,
  sendFailedTestEmail,
  sendOnboardingReminder,
  sendPassedTestEmail,
  sendTestReminder,
} from "../../_service/emailAction";
import { NewApplicantType } from "../../_service/types";

export default function ApplicantActionButton({
  applicant,
}: {
  applicant: NewApplicantType;
}) {
  const { toast } = useToast();

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
    | "remindToTakeTest"
    | "remindToOnboarding"
    | null
  >(null);

  const handleMoveToApplying = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToApplyingAction(applicant.id);
      setIsOpen(false);

      toast({
        title: "Applicant Moved",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to applying.`,
      });
    } catch (error) {
      console.error("Error moving applicant to applying:", error);
      toast({
        title: "Error",
        description:
          "Failed to move applicant to applying. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleMoveToTesting = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToTestingAction(applicant.id);
      setIsOpen(false);
      toast({
        title: "Applicant Moved",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to testing.`,
      });
    } catch (error) {
      console.error("Error moving applicant to Testing:", error);
      toast({
        title: "Error",
        description:
          "Failed to move applicant to testing. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleMoveToOnboarding = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToOnboardingAction(applicant.id);
      setIsOpen(false);
      toast({
        title: "Applicant Moved",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to onboarding.`,
      });
    } catch (error) {
      console.error("Error moving applicant to onboarding:", error);
      toast({
        title: "Error",
        description:
          "Failed to move applicant to onboarding. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleMoveToDenied = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      await sendDenyEmail({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });
      setIsOpen(false);
      toast({
        title: "Applicant Moved",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to denied.`,
      });
    } catch (error) {
      console.error("Error moving applicant to denied:", error);
      toast({
        title: "Error",
        description:
          "Failed to move applicant to denied. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleDeleteApplicant = async () => {
    setIsLoading(true);
    try {
      await deleteApplicantAction(applicant);
      setIsOpen(false);
      toast({
        title: "Applicant Deleted",
        description: `${applicant.first_name} ${applicant.last_name} has been deleted.`,
      });
    } catch (error) {
      console.error("Error deleting applicant:", error);
      toast({
        title: "Error",
        description: "Failed to delete applicant. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handlePassApplicant = async () => {
    setIsLoading(true);
    try {
      await passApplicantTestAction(applicant.id);
      await sendPassedTestEmail({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });

      toast({
        title: "Applicant Passed",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to onboarding.`,
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error passing all applicants:", error);
      toast({
        title: "Error",
        description: "Failed to pass applicant. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleFailApplicant = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      await sendFailedTestEmail({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });
      setIsOpen(false);
      toast({
        title: "Applicant Failed",
        description: `${applicant.first_name} ${applicant.last_name} has been marked as failed.`,
      });
    } catch (error) {
      console.error("Error failing all applicants:", error);
      toast({
        title: "Error",
        description: "Failed to fail applicant. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleAcceptApplicant = async () => {
    setIsLoading(true);
    try {
      await acceptApplicantAction(applicant.id);
      setIsOpen(false);
      toast({
        title: "Applicant Accepted",
        description: `${applicant.first_name} ${applicant.last_name} has been accepted.`,
      });
    } catch (error) {
      console.error("Error accepting all applicants:", error);
      toast({
        title: "Error",
        description: "Failed to accept applicant. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleDenyApplicant = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      await sendDenyEmail({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });
      setIsOpen(false);
      toast({
        title: "Applicant Denied",
        description: `${applicant.first_name} ${applicant.last_name} has been denied.`,
      });
    } catch (error) {
      console.error("Error denying all applicants:", error);
      toast({
        title: "Error",
        description: "Failed to deny applicant. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleRemindToTakeTest = async () => {
    setIsLoading(true);
    try {
      await sendTestReminder({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });

      setIsOpen(false);

      toast({
        title: "Reminder Sent",
        description: `A reminder has been sent to ${applicant.first_name} ${applicant.last_name} to take the test.`,
      });
    } catch (error) {
      console.error("Error sending reminder to take test:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleRemindToOnboarding = async () => {
    setIsLoading(true);
    try {
      await sendOnboardingReminder({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });

      setIsOpen(false);

      toast({
        title: "Reminder Sent",
        description: `A reminder has been sent to ${applicant.first_name} ${applicant.last_name} to complete the onboarding process.`,
      });
    } catch (error) {
      console.error("Error sending reminder to onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {applicant.application_status === "testing" && (
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            className="h-fit py-1 text-sm lg:text-base"
            onClick={() => {
              setDialogState("pass");
              setIsOpen(true);
            }}
          >
            Pass
          </Button>
          <Button
            variant={"destructive"}
            className="h-fit py-1 text-sm lg:text-base"
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
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            className="h-fit py-1 text-sm lg:text-base"
            onClick={() => {
              setDialogState("accept");
              setIsOpen(true);
            }}
          >
            Accept
          </Button>
          <Button
            variant={"destructive"}
            className="h-fit py-1 text-sm lg:text-base"
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
            {/* remind applicant to take test */}
            {(applicant.application_status === "applying" ||
              applicant.application_status === "testing") && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("remindToTakeTest");
                  setIsOpen(true);
                }}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                Remind to Take Test
              </DropdownMenuItem>
            )}

            {/* remind applicant of onboarding */}
            {applicant.application_status === "onboarding" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("remindToOnboarding");
                  setIsOpen(true);
                }}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                Remind to Onboard
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
                This will deny the applicant&apos;s current application, but
                they can reapply after 3 months. Are you sure?
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

        {dialogState === "remindToTakeTest" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remind to Take Test</DialogTitle>
              <DialogDescription>
                This will send a reminder email to the applicant to take the
                test. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleRemindToTakeTest} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Send Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "remindToOnboarding" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remind to Onboard</DialogTitle>
              <DialogDescription>
                This will send a reminder email to the applicant to complete the
                onboarding process. Are you sure?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleRemindToOnboarding} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                )}
                Send Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
