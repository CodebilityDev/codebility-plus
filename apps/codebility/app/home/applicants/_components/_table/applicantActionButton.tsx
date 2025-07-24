"use client";

import React from "react";
import { MoreHorizontalIcon, MailIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Button } from "@codevs/ui/button";
import { NewApplicantType } from "../../_service/types";
import { useApplicantActions } from "./useApplicantActions";
import ApplicantConfirmationDialog from "./ApplicantConfirmationDialog";
import { ActionType } from "./applicantActionTypes";

interface ApplicantActionButtonProps {
  applicant: NewApplicantType;
}

// Menu items configuration based on applicant status
const getMenuItems = (status: string): Array<{ action: ActionType; label: string; icon?: React.ReactNode }> => {
  const baseEmailItems = [
    { action: "remindToTakeTest" as ActionType, label: "Remind to Take Test", icon: <MailIcon className="h-4 w-4" /> },
    { action: "remindToOnboarding" as ActionType, label: "Remind for Onboarding", icon: <MailIcon className="h-4 w-4" /> },
  ];

  switch (status.toLowerCase()) {
    case "applying":
      return [
        { action: "testing" as ActionType, label: "Move to Testing" },
        { action: "accept" as ActionType, label: "Accept" },
        { action: "deny" as ActionType, label: "Deny" },
        ...baseEmailItems,
        { action: "delete" as ActionType, label: "Delete" },
      ];
    case "testing":
      return [
        { action: "pass" as ActionType, label: "Pass Test" },
        { action: "fail" as ActionType, label: "Fail Test" },
        { action: "onboarding" as ActionType, label: "Move to Onboarding" },
        ...baseEmailItems,
        { action: "delete" as ActionType, label: "Delete" },
      ];
    case "passed":
      return [
        { action: "onboarding" as ActionType, label: "Move to Onboarding" },
        { action: "accept" as ActionType, label: "Accept" },
        { action: "deny" as ActionType, label: "Deny" },
        ...baseEmailItems,
        { action: "delete" as ActionType, label: "Delete" },
      ];
    case "onboarding":
      return [
        { action: "accept" as ActionType, label: "Accept" },
        { action: "deny" as ActionType, label: "Deny" },
        ...baseEmailItems,
        { action: "delete" as ActionType, label: "Delete" },
      ];
    default:
      return [
        { action: "applying" as ActionType, label: "Move to Applying" },
        { action: "testing" as ActionType, label: "Move to Testing" },
        { action: "accept" as ActionType, label: "Accept" },
        { action: "deny" as ActionType, label: "Deny" },
        ...baseEmailItems,
        { action: "delete" as ActionType, label: "Delete" },
      ];
  }
};

export default function ApplicantActionButton({ applicant }: ApplicantActionButtonProps) {
  const {
    isLoading,
    isDialogOpen,
    currentAction,
    executeAction,
    openConfirmationDialog,
    closeDialog,
  } = useApplicantActions(applicant);

  const menuItems = getMenuItems(applicant.application_status || "");

  const handleConfirm = () => {
    if (currentAction) {
      executeAction(currentAction);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0" 
            disabled={isLoading}
            aria-haspopup="menu"
            aria-expanded="false"
            aria-label={`Actions for ${applicant.first_name} ${applicant.last_name} (${applicant.application_status})`}
          >
            <span className="sr-only">
              Open actions menu for {applicant.first_name} {applicant.last_name}
            </span>
            <MoreHorizontalIcon className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" role="menu" aria-label="Applicant actions">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {menuItems.map(({ action, label, icon }) => (
            <DropdownMenuItem
              key={action}
              onClick={() => openConfirmationDialog(action)}
              className={action === "delete" || action === "deny" || action === "fail" ? "text-red-600" : ""}
              role="menuitem"
              aria-describedby={action === "delete" || action === "deny" || action === "fail" ? "destructive-action-warning" : undefined}
            >
              {icon && <span className="mr-2" aria-hidden="true">{icon}</span>}
              {label}
              {(action === "delete" || action === "deny" || action === "fail") && (
                <span className="sr-only"> - This is a destructive action</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Hidden warning text for destructive actions */}
      <div id="destructive-action-warning" className="sr-only">
        This action cannot be undone and may permanently affect the applicant's status.
      </div>

      <ApplicantConfirmationDialog
        isOpen={isDialogOpen}
        isLoading={isLoading}
        actionType={currentAction}
        onConfirm={handleConfirm}
        onCancel={closeDialog}
      />
    </>
  );
}