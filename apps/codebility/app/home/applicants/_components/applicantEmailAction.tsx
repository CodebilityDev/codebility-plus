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
import { Loader2Icon, MailIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

import { sendMultipleTestReminderEmail } from "../_service/emailAction";
import { NewApplicantType } from "../_service/types";
import { set } from "date-fns";

export default function ApplicantEmailAction({
  applicants,
}: {
  applicants: NewApplicantType[];
}) {
  const [dialogState, setDialogState] = React.useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRemindAllApplicants = async () => {
    setIsLoading(true);
    try {
      await sendMultipleTestReminderEmail(["test-3e807c@test.mailgenius.com"]);

      setDialogOpen(false);
      setDialogState(null);
    } catch (error) {
      console.error("Error sending reminder emails:", error);
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
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => {
                setDialogState("remindToTakeTest");
                setDialogOpen(true);
              }}
            >
              Remind All Applicants to Take the Test
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={() => {
                setDialogState("remindToFinishTest");
                setDialogOpen(true);
              }}
            >
              Remind All Applicants to Finish the Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {dialogState === "remindToTakeTest" && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Remind All Applicant to Take the Test</DialogTitle>
              <DialogDescription>
                Are you sure you want to remind all applicants to take the test?
                This will send a reminder email to all applicants who have not
                yet taken the test.
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
      </Dialog>
    </div>
  );
}
