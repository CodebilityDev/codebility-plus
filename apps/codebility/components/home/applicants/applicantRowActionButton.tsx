"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/global/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/global/ui/dialog";
import { useToast } from "@/components/global/ui/use-toast";
import { cn } from "@/utils/global/cn";

import { Loader2Icon, MailIcon, MoreHorizontalIcon } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@codevs/ui/dropdown-menu";

import { multipleAcceptApplicantAction, multipleDeleteApplicantAction, multipleDenyApplicantAction, multipleMoveApplicantToApplyingAction, multipleMoveApplicantToOnboardingAction, multipleMoveApplicantToTestingAction, multiplePassApplicantTestAction } from "@/actions/home/applicants/applicants";
import { sendMultipleDenyEmail } from "@/actions/home/applicants/deny-email";
import { sendMultipleOnboardingReminderWithUpdate } from "@/actions/home/applicants/onboarding-reminder-email";
import { sendMultiplePassedTestEmail } from "@/actions/home/applicants/passed-test-email";
import { sendMultipleTestReminderEmailWithUpdate } from "@/actions/home/applicants/test-reminder-email";
import type { ApplicantRowActionButtonProps, NewApplicantType } from "@/types/home/applicants/applicants";

interface RowState {
  application_status: string;
  reminded_count: number;
}

export default function ApplicantRowActionButton({
  applicants,
  onActionComplete,
}: ApplicantRowActionButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogState, setDialogState] = useState<
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
    | "viewApplicant"
    | null
  >(null);

  const [rowState, setRowState] = useState<Record<string, RowState>>({});

  const statusOf = (applicant: NewApplicantType) =>
    rowState[applicant.id]?.application_status ?? applicant.application_status;

  const activeStatus = applicants[0] ? statusOf(applicants[0]) : null;

  const recordRowState = (patch: (current: RowState) => Partial<RowState>) => {
    setRowState((prev) => {
      const next = { ...prev };
      for (const applicant of applicants) {
        const current = next[applicant.id] ?? {
          application_status: applicant.application_status,
          reminded_count: applicant.applicant?.reminded_count ?? 0,
        };
        next[applicant.id] = { ...current, ...patch(current) };
      }
      return next;
    });
  };

  const moveRowsTo = (status: string) => {
    recordRowState(() => ({ application_status: status, reminded_count: 0 }));
    if (
      applicants.some((applicant) => applicant.application_status !== status)
    ) {
      router.refresh();
    }
  };

  const handleMoveAllToApplying = async () => {
    setLoading(true);
    try {
      await multipleMoveApplicantToApplyingAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
      toast({
        title: "Applicants moved to applying",
        description: "All selected applicants have been moved to applying.",
      });
      onActionComplete?.();
      moveRowsTo("applying");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to move applicants to applying.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleMoveAllToTesting = async () => {
    setLoading(true);
    try {
      await multipleMoveApplicantToTestingAction(
        applicants.map((applicant) => applicant.id),
      );
      toast({
        title: "Applicants moved to testing",
        description: "All selected applicants have been moved to testing.",
      });
      setOpen(false);
      onActionComplete?.();
      moveRowsTo("testing");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move applicants to testing.",
        variant: "destructive",
      });
      console.error(error);
    }
    setLoading(false);
  };

  const handleMoveAllToOnboarding = async () => {
    setLoading(true);
    try {
      await multipleMoveApplicantToOnboardingAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
      toast({
        title: "Applicants moved to onboarding",
        description: "All selected applicants have been moved to onboarding.",
      });
      onActionComplete?.();
      moveRowsTo("onboarding");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to move applicants to onboarding.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDenyAll = async () => {
    setLoading(true);
    try {
      await multipleDenyApplicantAction(
        applicants.map((applicant) => applicant.id),
      );
      await sendMultipleDenyEmail(
        applicants.map((applicant) => ({
          email: applicant.email_address,
          name: `${applicant.first_name} ${applicant.last_name}`,
        })),
      );
      setOpen(false);
      toast({
        title: "Applicants denied",
        description: "All selected applicants have been denied.",
      });
      onActionComplete?.();
      moveRowsTo("denied");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handlePassAll = async () => {
    setLoading(true);
    try {
      await multiplePassApplicantTestAction(
        applicants.map((applicant) => applicant.id),
      );
      await sendMultiplePassedTestEmail(
        applicants.map((applicant) => ({
          email: applicant.email_address,
          name: `${applicant.first_name} ${applicant.last_name}`,
        })),
      );
      setOpen(false);
      toast({
        title: "Applicants passed",
        description: "All selected applicants have passed the test.",
      });
      onActionComplete?.();
      moveRowsTo("onboarding");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to pass applicants.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleAcceptAll = async () => {
    setLoading(true);
    try {
      await multipleAcceptApplicantAction(
        applicants.map((applicant) => applicant.id),
      );
      setOpen(false);
      toast({
        title: "Applicants accepted",
        description: "All selected applicants have been accepted.",
      });
      onActionComplete?.();
      moveRowsTo("passed");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to accept applicants.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      await multipleDeleteApplicantAction(applicants);
      setOpen(false);
      toast({
        title: "Applicants deleted",
        description: "All selected applicants have been deleted.",
      });
      onActionComplete?.();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete applicants.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleRemindToTakeTest = async () => {
    setLoading(true);
    try {
      await sendMultipleTestReminderEmailWithUpdate(
        applicants.map((applicant) => ({
          email: applicant.email_address,
          applicantId: applicant.id
        })),
      );

      setOpen(false);

      toast({
        title: "Reminder sent",
        description:
          "All selected applicants have been reminded to take the test.",
      });
      onActionComplete?.();
      recordRowState((current) => ({ reminded_count: current.reminded_count + 1 }));
    } catch (error) {
      console.error("Error sending reminder emails:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder emails.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleRemindToOnboarding = async () => {
    setLoading(true);
    try {
      await sendMultipleOnboardingReminderWithUpdate(
        applicants.map((applicant) => ({
          email: applicant.email_address,
          applicantId: applicant.id
        })),
      );

      setOpen(false);

      toast({
        title: "Reminder sent",
        description:
          "All selected applicants have been reminded to complete onboarding.",
      });
      onActionComplete?.();
      recordRowState((current) => ({ reminded_count: current.reminded_count + 1 }));
    } catch (error) {
      console.error("Error sending onboarding reminder emails:", error);
      toast({
        title: "Error",
        description: "Failed to send onboarding reminder emails.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {(activeStatus === "applying" ||
        activeStatus === "denied") && (
        <Button
          variant="destructive"
          className="h-fit py-1 text-xs lg:text-sm bg-red-500"
          onClick={() => {
            setDialogState("delete");
            setOpen(true);
          }}
        >
          Delete All
        </Button>
      )}

      {activeStatus === "testing" && (
        <>
          <Button
            className="h-fit py-1 text-xs lg:text-sm"
            onClick={() => {
              setDialogState("pass");
              setOpen(true);
            }}
          >
            Pass All
          </Button>
          <Button
            variant={"destructive"}
            className="h-fit py-1 text-xs lg:text-sm"
            onClick={() => {
              setDialogState("fail");
              setOpen(true);
            }}
          >
            Fail All
          </Button>
        </>
      )}

      {(activeStatus === "onboarding" ||
        activeStatus === "waitlist") && (
        <>
          <Button
            className="h-fit py-1 text-xs lg:text-sm"
            onClick={() => {
              setDialogState("accept");
              setOpen(true);
            }}
          >
            Accept All
          </Button>
          <Button
            variant={"destructive"}
            className="h-fit py-1 text-xs lg:text-sm"
            onClick={() => {
              setDialogState("deny");
              setOpen(true);
            }}
          >
            Deny All
          </Button>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "p-0 text-gray-400 hover:text-gray-300",
                applicants.length === 0 && "invisible",
              )}
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
            {activeStatus !== "applying" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("applying");
                  setOpen(true);
                }}
              >
                Move All to Applying
              </DropdownMenuItem>
            )}
            {activeStatus !== "testing" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("testing");
                  setOpen(true);
                }}
              >
                Move All to Testing
              </DropdownMenuItem>
            )}
            {activeStatus !== "onboarding" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("onboarding");
                  setOpen(true);
                }}
              >
                Move All to Onboarding
              </DropdownMenuItem>
            )}
            {activeStatus !== "denied" && (
              <DropdownMenuItem
                className="cursor-pointer text-red-500"
                onClick={() => {
                  setDialogState("denied");
                  setOpen(true);
                }}
              >
                Move All to Denied
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />
            {/* remind all to take test */}
            {(activeStatus === "testing" ||
              activeStatus === "applying") && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("remindToTakeTest");
                  setOpen(true);
                }}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                Remind All to Take Test
              </DropdownMenuItem>
            )}

            {/* remind all to onboarding */}
            {activeStatus === "onboarding" && (
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("remindToOnboarding");
                  setOpen(true);
                }}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                Remind All to Onboarding
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {activeStatus === "testing" && (
              <div className="block cursor-pointer sm:hidden">
                <DropdownMenuItem
                  onClick={() => {
                    setDialogState("pass");
                    setOpen(true);
                  }}
                >
                  Pass All
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => {
                    setDialogState("fail");
                    setOpen(true);
                  }}
                >
                  Fail All
                </DropdownMenuItem>
              </div>
            )}

            {(activeStatus === "onboarding" ||
              activeStatus === "waitlist") && (
              <div className="block cursor-pointer sm:hidden">
                <DropdownMenuItem
                  onClick={() => {
                    setDialogState("accept");
                    setOpen(true);
                  }}
                >
                  Accept All
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer text-red-500"
                  onClick={() => {
                    setDialogState("deny");
                    setOpen(true);
                  }}
                >
                  Deny All
                </DropdownMenuItem>
              </div>
            )}

            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={() => {
                setDialogState("delete");
                setOpen(true);
              }}
            >
              Delete All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {dialogState === "applying" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move All to Applying</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to move all selected applicants to
                applying?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMoveAllToApplying} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "testing" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move All to Testing</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to move all selected applicants to
                testing?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMoveAllToTesting} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "onboarding" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move to Onboarding</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to move all selected applicants to
                Onboarding?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleMoveAllToOnboarding} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "denied" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Move to Denied</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to move all selected applicants to Denied?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDenyAll}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Move
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "pass" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pass All</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>Are you sure you want to pass all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handlePassAll} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Pass
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "fail" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Fail All</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>Are you sure you want to fail all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDenyAll}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Fail
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "accept" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accept All</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>Are you sure you want to accept all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAcceptAll} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Accept
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "deny" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deny All</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>Are you sure you want to deny all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDenyAll}
                  disabled={loading}
                  variant="destructive"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Deny
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "delete" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete All</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>Are you sure you want to delete all selected applicants?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteAll}
                  disabled={loading}
                  variant="destructive"
                  className="bg-red-500"
                >
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {dialogState === "remindToTakeTest" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remind All to Take the Test</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <p>
                Are you sure you want to remind all selected applicants to take
                the test?
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setOpen(false)} className="">
                  Cancel
                </Button>
                <Button onClick={handleRemindToTakeTest} disabled={loading}>
                  {loading && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Remind
                </Button>
              </div>
            </div>
          </DialogContent>
        )}

        {
          dialogState === "remindToOnboarding" && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remind All to Onboarding</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <p>
                  Are you sure you want to remind all selected applicants to
                  complete onboarding?
                </p>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleRemindToOnboarding} disabled={loading}>
                    {loading && (
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Remind
                  </Button>
                </div>
              </div>
            </DialogContent>
          )
        }
      </Dialog>
    </div>
  );
}
