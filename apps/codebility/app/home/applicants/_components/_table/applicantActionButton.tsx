// apps/codebility/app/home/applicants/_components/_table/applicantActionButton.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useApplicantModal } from "../ApplicantClientWrapper";

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
  const router = useRouter();
  const { openModal } = useApplicantModal(); // Use our custom modal context

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    | null
  >(null);

  // Handle View Details click - uses our custom modal system
  const handleViewDetails = () => {
    openModal(applicant);
  };

  // Handle Edit Applicant click
  const handleEditApplicant = () => {
    toast({
      title: "Edit Applicant",
      description: "Edit functionality will be implemented soon.",
    });
  };

  // All other handlers remain the same...
  const handleMoveToApplying = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToApplyingAction(applicant.id);
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Moved",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to applying.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error moving applicant to applying:", error);
      toast({
        title: "Error",
        description: "Failed to move applicant to applying. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToTesting = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToTestingAction(applicant.id);
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Moved",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to testing.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error moving applicant to testing:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to move applicant to testing. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToOnboarding = async () => {
    setIsLoading(true);
    try {
      await moveApplicantToOnboardingAction(applicant.id);
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Moved",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to onboarding.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error moving applicant to onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to move applicant to onboarding. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToDenied = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Denied",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to denied.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error moving applicant to denied:", error);
      toast({
        title: "Error",
        description: "Failed to move applicant to denied. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePassApplicant = async () => {
    setIsLoading(true);
    try {
      await passApplicantTestAction(applicant.id);
      await sendPassedTestEmail({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Passed",
        description: `${applicant.first_name} ${applicant.last_name} has been moved to onboarding.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error passing applicant:", error);
      toast({
        title: "Error",
        description: "Failed to pass applicant. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFailApplicant = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      await sendFailedTestEmail({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Failed",
        description: `${applicant.first_name} ${applicant.last_name} has been marked as failed.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error failing applicant:", error);
      toast({
        title: "Error",
        description: "Failed to fail applicant. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptApplicant = async () => {
    setIsLoading(true);
    try {
      await acceptApplicantAction(applicant.id);
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Accepted",
        description: `${applicant.first_name} ${applicant.last_name} has been accepted.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error accepting applicant:", error);
      toast({
        title: "Error",
        description: "Failed to accept applicant. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyApplicant = async () => {
    setIsLoading(true);
    try {
      await denyApplicantAction(applicant.id);
      await sendDenyEmail({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
      });
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Applicant Denied",
        description: `${applicant.first_name} ${applicant.last_name} has been denied.`,
      });
      router.refresh();
    } catch (error) {
      console.error("Error denying applicant:", error);
      toast({
        title: "Error",
        description: "Failed to deny applicant. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemindToTakeTest = async () => {
    setIsLoading(true);
    try {
      await sendTestReminder(applicant.email_address);
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Reminder Sent",
        description: `Test reminder sent to ${applicant.first_name} ${applicant.last_name}.`,
      });
    } catch (error) {
      console.error("Error sending test reminder:", error);
      toast({
        title: "Error",
        description: "Failed to send test reminder. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemindToOnboarding = async () => {
    setIsLoading(true);
    try {
      await sendOnboardingReminder(applicant.email_address);
      setIsDialogOpen(false);
      setDialogState(null);
      toast({
        title: "Reminder Sent",
        description: `Onboarding reminder sent to ${applicant.first_name} ${applicant.last_name}.`,
      });
    } catch (error) {
      console.error("Error sending onboarding reminder:", error);
      toast({
        title: "Error",
        description: "Failed to send onboarding reminder. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDialogTitle = () => {
    switch (dialogState) {
      case "applying": return "Move to Applying";
      case "testing": return "Move to Testing";
      case "onboarding": return "Move to Onboarding";
      case "denied": return "Move to Denied";
      case "delete": return "Delete Applicant";
      case "pass": return "Pass Applicant";
      case "fail": return "Fail Applicant";
      case "accept": return "Accept Applicant";
      case "deny": return "Deny Applicant";
      case "remindToTakeTest": return "Send Test Reminder";
      case "remindToOnboarding": return "Send Onboarding Reminder";
      default: return "Confirm Action";
    }
  };

  const getDialogDescription = () => {
    const name = `${applicant.first_name} ${applicant.last_name}`;
    switch (dialogState) {
      case "applying": return `Are you sure you want to move ${name} to applying?`;
      case "testing": return `Are you sure you want to move ${name} to testing?`;
      case "onboarding": return `Are you sure you want to move ${name} to onboarding?`;
      case "denied": return `Are you sure you want to move ${name} to denied?`;
      case "delete": return `Are you sure you want to delete ${name}? This action cannot be undone.`;
      case "pass": return `Are you sure you want to pass ${name}? They will be moved to onboarding.`;
      case "fail": return `Are you sure you want to fail ${name}? They will be moved to denied.`;
      case "accept": return `Are you sure you want to accept ${name}? They will become an active member.`;
      case "deny": return `Are you sure you want to deny ${name}? This will send them a denial email.`;
      case "remindToTakeTest": return `Are you sure you want to send a test reminder to ${name}?`;
      case "remindToOnboarding": return `Are you sure you want to send an onboarding reminder to ${name}?`;
      default: return "Please confirm your action.";
    }
  };

  const handleConfirmAction = () => {
    switch (dialogState) {
      case "applying": return handleMoveToApplying();
      case "testing": return handleMoveToTesting();
      case "onboarding": return handleMoveToOnboarding();
      case "denied": return handleMoveToDenied();
      case "pass": return handlePassApplicant();
      case "fail": return handleFailApplicant();
      case "accept": return handleAcceptApplicant();
      case "deny": return handleDenyApplicant();
      case "remindToTakeTest": return handleRemindToTakeTest();
      case "remindToOnboarding": return handleRemindToOnboarding();
      default: return;
    }
  };

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
          
          {/* Primary Actions */}
          <DropdownMenuItem 
            className="text-black-500 dark:text-light-800 cursor-pointer"
            onClick={handleViewDetails}
          >
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="text-black-500 dark:text-light-800 cursor-pointer"
            onClick={handleEditApplicant}
          >
            Edit Applicant
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />

          {/* Status Change Actions */}
          {applicant.application_status !== "applying" && (
            <DropdownMenuItem
              className="text-black-500 dark:text-light-800 cursor-pointer"
              onClick={() => {
                setDialogState("applying");
                setIsDialogOpen(true);
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
                setIsDialogOpen(true);
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
                setIsDialogOpen(true);
              }}
            >
              Move to Onboarding
            </DropdownMenuItem>
          )}

          {applicant.application_status !== "denied" && (
            <DropdownMenuItem
              className="text-red-500 dark:text-red-400 cursor-pointer"
              onClick={() => {
                setDialogState("denied");
                setIsDialogOpen(true);
              }}
            >
              Move to Denied
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Test Actions - only show for testing status */}
          {applicant.application_status === "testing" && (
            <>
              <DropdownMenuItem
                className="text-green-500 dark:text-green-400 cursor-pointer"
                onClick={() => {
                  setDialogState("pass");
                  setIsDialogOpen(true);
                }}
              >
                Pass Test
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 dark:text-red-400 cursor-pointer"
                onClick={() => {
                  setDialogState("fail");
                  setIsDialogOpen(true);
                }}
              >
                Fail Test
              </DropdownMenuItem>
            </>
          )}

          {/* Onboarding Actions - only show for onboarding status */}
          {applicant.application_status === "onboarding" && (
            <>
              <DropdownMenuItem
                className="text-green-500 dark:text-green-400 cursor-pointer"
                onClick={() => {
                  setDialogState("accept");
                  setIsDialogOpen(true);
                }}
              >
                Accept Applicant
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 dark:text-red-400 cursor-pointer"
                onClick={() => {
                  setDialogState("deny");
                  setIsDialogOpen(true);
                }}
              >
                Deny Applicant
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-black-500 dark:text-light-800 cursor-pointer"
                onClick={() => {
                  setDialogState("remindToOnboarding");
                  setIsDialogOpen(true);
                }}
              >
                <MailIcon className="mr-2 h-4 w-4" />
                Remind to Onboarding
              </DropdownMenuItem>
            </>
          )}

          {/* Remind to Take Test - show for testing and applying status */}
          {(applicant.application_status === "testing" || applicant.application_status === "applying") && (
            <DropdownMenuItem
              className="text-black-500 dark:text-light-800 cursor-pointer"
              onClick={() => {
                setDialogState("remindToTakeTest");
                setIsDialogOpen(true);
              }}
            >
              <MailIcon className="mr-2 h-4 w-4" />
              Remind to Take Test
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen && dialogState !== null} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setDialogState(null);
          setIsLoading(false); // Reset loading state when dialog closes
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setDialogState(null);
                setIsLoading(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isLoading}
              variant={dialogState === "delete" || dialogState === "denied" || dialogState === "fail" || dialogState === "deny" ? "destructive" : "default"}
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}