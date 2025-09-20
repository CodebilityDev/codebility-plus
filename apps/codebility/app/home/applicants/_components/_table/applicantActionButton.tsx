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
import { cn } from "@/lib/utils";
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
  sendOnboardingReminderWithUpdate,
  sendPassedTestEmail,
  sendTestReminderWithUpdate,
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
      await sendTestReminderWithUpdate({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
        applicantId: applicant.id
      });
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
      await sendOnboardingReminderWithUpdate({
        email: applicant.email_address,
        name: `${applicant.first_name} ${applicant.last_name}`,
        applicantId: applicant.id
      });
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
            size="sm"
            className="h-8 w-8 rounded-full p-0 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            <span className="sr-only">More actions</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[200px] rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          
          {/* Primary Actions */}
          <DropdownMenuItem 
            className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 dark:text-gray-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
            onClick={handleViewDetails}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            onClick={handleEditApplicant}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Applicant
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

          {/* Status Change Actions */}
          {applicant.application_status !== "applying" && (
            <DropdownMenuItem
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:bg-gray-50 focus:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              onClick={() => {
                setDialogState("applying");
                setIsDialogOpen(true);
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Move to Applying
            </DropdownMenuItem>
          )}

          {applicant.application_status !== "testing" && (
            <DropdownMenuItem
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-amber-700 transition-colors hover:bg-amber-50 hover:text-amber-800 focus:bg-amber-50 focus:text-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20 dark:hover:text-amber-300"
              onClick={() => {
                setDialogState("testing");
                setIsDialogOpen(true);
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Move to Testing
            </DropdownMenuItem>
          )}

          {applicant.application_status !== "onboarding" && (
            <DropdownMenuItem
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800 focus:bg-emerald-50 focus:text-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-300"
              onClick={() => {
                setDialogState("onboarding");
                setIsDialogOpen(true);
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Move to Onboarding
            </DropdownMenuItem>
          )}

          {applicant.application_status !== "denied" && (
            <DropdownMenuItem
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50 hover:text-red-800 focus:bg-red-50 focus:text-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
              onClick={() => {
                setDialogState("denied");
                setIsDialogOpen(true);
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Move to Denied
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

          {/* Test Actions - only show for testing status */}
          {applicant.application_status === "testing" && (
            <>
              <DropdownMenuItem
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-50 hover:text-green-800 focus:bg-green-50 focus:text-green-800 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                onClick={() => {
                  setDialogState("pass");
                  setIsDialogOpen(true);
                }}
              >
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                Pass Test
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50 hover:text-red-800 focus:bg-red-50 focus:text-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                onClick={() => {
                  setDialogState("fail");
                  setIsDialogOpen(true);
                }}
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fail Test
              </DropdownMenuItem>
            </>
          )}

          {/* Onboarding Actions - only show for onboarding status */}
          {applicant.application_status === "onboarding" && (
            <>
              <DropdownMenuItem
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-50 hover:text-green-800 focus:bg-green-50 focus:text-green-800 dark:text-green-400 dark:hover:bg-green-900/20 dark:hover:text-green-300"
                onClick={() => {
                  setDialogState("accept");
                  setIsDialogOpen(true);
                }}
              >
                <CheckCircle2Icon className="mr-2 h-4 w-4" />
                Accept Applicant
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-700 transition-colors hover:bg-red-50 hover:text-red-800 focus:bg-red-50 focus:text-red-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                onClick={() => {
                  setDialogState("deny");
                  setIsDialogOpen(true);
                }}
              >
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Deny Applicant
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer rounded-md px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus:bg-blue-50 focus:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
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
              className="cursor-pointer rounded-md px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-50 hover:text-blue-800 focus:bg-blue-50 focus:text-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
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
        <DialogContent className="rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsDialogOpen(false);
                setDialogState(null);
                setIsLoading(false);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isLoading}
              variant={dialogState === "delete" || dialogState === "denied" || dialogState === "fail" || dialogState === "deny" ? "destructive" : "default"}
              className={cn(
                "min-w-[100px]",
                (dialogState === "delete" || dialogState === "denied" || dialogState === "fail" || dialogState === "deny") 
                  ? "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              )}
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