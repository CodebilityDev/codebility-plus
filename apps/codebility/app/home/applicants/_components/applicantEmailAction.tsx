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
import { set } from "date-fns";
import { Loader2Icon, MailIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import {
  sendMultipleOnboardingReminderWithUpdate,
  sendMultipleTestReminderEmailWithUpdate,
} from "../_service/email";
import { NewApplicantType } from "../_service/types";

export default function ApplicantEmailAction({
  applicants,
}: {
  applicants: NewApplicantType[];
}) {
  const { toast } = useToast();

  const [dialogState, setDialogState] = React.useState<
    "remindToTakeTest" | "remindToOnboard" | null
  >(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemindAllApplicants = async () => {
    setIsLoading(true);
    try {
      //fitter those who already submitted the test
      const applicantsToRemind = applicants.filter(
        (applicant) => !applicant.applicant?.fork_url,
      );

      await sendMultipleTestReminderEmailWithUpdate(
        applicantsToRemind.map((applicant) => ({
          email: applicant.email_address,
          applicantId: applicant.id
        })),
      );

      setDialogOpen(false);
      setDialogState(null);

      toast({
        title: "Reminder Emails Sent",
        description: "All applicants have been reminded to take the test.",
      });
    } catch (error) {
      console.error("Error sending reminder emails:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder emails. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  // Handle remind to onboard
  const handleRemindToOnboard = async () => {
    setIsLoading(true);
    try {
      await sendMultipleOnboardingReminderWithUpdate(
        applicants.map((applicant) => ({
          email: applicant.email_address,
          applicantId: applicant.id
        })),
      );

      setDialogOpen(false);
      setDialogState(null);

      toast({
        title: "Reminder Emails Sent",
        description: "All applicants have been reminded to onboard.",
      });
    } catch (error) {
      console.error("Error sending reminder emails:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder emails. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };
  return (
    <div className="mr-14">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <MailIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 gap-2">
            {/* remind to take test */}
            {(applicants[0]?.application_status === "testing" ||
              applicants[0]?.application_status === "applying") && (
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => {
                  setDialogState("remindToTakeTest");
                  setDialogOpen(true);
                }}
              >
                Remind All Applicants to Take the Test
              </DropdownMenuItem>
            )}

            {/* remind to onboard */}
            {applicants[0]?.application_status === "onboarding" && (
              <DropdownMenuItem
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => {
                  setDialogState("remindToOnboard");
                  setDialogOpen(true);
                }}
              >
                Remind All Applicants to Onboard
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {dialogState === "remindToTakeTest" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remind All Applicant to Take the Test</DialogTitle>
              <DialogDescription>
                Are you sure you want to remind all applicants to take the test?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleRemindAllApplicants} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MailIcon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}

        {dialogState === "remindToOnboard" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remind All Applicant to Onboard</DialogTitle>
              <DialogDescription>
                Are you sure you want to remind all applicants to onboard?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleRemindToOnboard} disabled={isLoading}>
                {isLoading ? (
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MailIcon className="mr-2 h-4 w-4" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
