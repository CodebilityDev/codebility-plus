"use client";

import { useState } from "react";
import {
  approveAction,
  denyAction,
  moveToOnboardingAction,
  rejectAction,
} from "@/app/home/applicants/action";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Codev } from "@/types/home/codev";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MoreHorizontal,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

interface ApplicantStatusButtonsProps {
  applicant: Codev;
  onStatusChange?: () => void;
}

export default function ApplicantStatusButtons({
  applicant,
  onStatusChange,
}: ApplicantStatusButtonsProps) {
  const status = applicant.application_status || "applying";
  const [dialogType, setDialogType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Close dialog
  const closeDialog = () => {
    setDialogType(null);
    setIsLoading(false);
  };

  // Mark as ready for onboarding (passed assessment)
  const markAsOnboarding = async () => {
    setIsLoading(true);
    try {
      const result = await moveToOnboardingAction(applicant.id);
      if (result.success) {
        toast.success("Applicant moved to onboarding phase");
        if (onStatusChange) onStatusChange();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      closeDialog();
    }
  };

  // Mark as denied (can reapply later)
  const markAsDenied = async () => {
    setIsLoading(true);
    try {
      const result = await denyAction(applicant.id);
      if (result.success) {
        toast.success("Applicant marked as denied");
        if (onStatusChange) onStatusChange();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      closeDialog();
    }
  };

  // Mark as rejected (permanently rejected)
  const markAsRejected = async () => {
    setIsLoading(true);
    try {
      const result = await rejectAction(applicant.id);
      if (result.success) {
        toast.success("Applicant has been rejected");
        if (onStatusChange) onStatusChange();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      closeDialog();
    }
  };

  // Mark as approved (final acceptance)
  const markAsApproved = async () => {
    setIsLoading(true);
    try {
      const result = await approveAction(applicant.id);
      if (result.success) {
        toast.success("Applicant has been approved");
        if (onStatusChange) onStatusChange();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      closeDialog();
    }
  };

  // For applying status, we only show the dropdown menu
  if (status === "applying") {
    return (
      <div className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">More actions</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="dark:bg-dark-200 min-w-[160px] bg-white"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
              Edit Applicant
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-500">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Testing tab: Pass or Fail */}
        {status === "testing" && (
          <div className="flex items-center gap-1.5">
            <button
              className="rounded-md bg-green-500 px-3 py-1 text-sm font-medium text-white transition-all hover:bg-green-600 hover:shadow-md active:scale-95"
              onClick={() => setDialogType("onboarding")}
              disabled={isLoading}
            >
              Pass
            </button>
            <button
              className="rounded-md border border-red-500 px-3 py-1 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:shadow-md active:scale-95"
              onClick={() => setDialogType("reject")}
              disabled={isLoading}
            >
              Fail
            </button>

            {/* More actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">More actions</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-dark-200 min-w-[160px] bg-white"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
                  Edit Applicant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Onboarding tab: Accept or Deny */}
        {status === "onboarding" && (
          <div className="flex items-center gap-1.5">
            <button
              className="rounded-md bg-indigo-500 px-3 py-1 text-sm font-medium text-white transition-all hover:bg-indigo-600 hover:shadow-md active:scale-95"
              onClick={() => setDialogType("approve")}
              disabled={isLoading}
            >
              Accept
            </button>
            <button
              className="rounded-md border border-red-500 px-3 py-1 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:shadow-md active:scale-95"
              onClick={() => setDialogType("deny")}
              disabled={isLoading}
            >
              Deny
            </button>

            {/* More actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">More actions</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-dark-200 min-w-[160px] bg-white"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
                  Edit Applicant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {status === "denied" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Can reapply after 3 months
            </span>

            {/* More actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
                >
                  <span className="sr-only">More actions</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-dark-200 min-w-[160px] bg-white"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-black-500 dark:text-light-800 cursor-pointer">
                  View Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Move to Onboarding Dialog */}
      <Dialog
        open={dialogType === "onboarding"}
        onOpenChange={() => closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pass Assessment</DialogTitle>
            <DialogDescription>
              This will move the applicant to the onboarding phase. Has this
              applicant completed the assessment successfully?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={markAsOnboarding} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog
        open={dialogType === "approve"}
        onOpenChange={() => closeDialog()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accept Applicant</DialogTitle>
            <DialogDescription>
              This will approve the applicant and mark them as an official CODEV
              member. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={markAsApproved}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deny Dialog */}
      <Dialog open={dialogType === "deny"} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deny Applicant</DialogTitle>
            <DialogDescription>
              This will deny the applicant's current application, but they can
              reapply after 3 months. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={markAsDenied}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Deny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fail/Reject Dialog */}
      <Dialog open={dialogType === "reject"} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fail Applicant</DialogTitle>
            <DialogDescription>
              This will mark the applicant as rejected for failing the
              assessment. This increases their rejection count. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2">
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={markAsRejected}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AlertCircle className="mr-2 h-4 w-4" />
              )}
              Fail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
