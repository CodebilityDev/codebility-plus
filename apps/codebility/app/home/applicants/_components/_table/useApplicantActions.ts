import { useState } from "react";
import { useToast } from "@codevs/ui/use-toast";
import { ActionType } from "./applicantActionTypes";
import { ACTION_CONFIG } from "./applicantActionConfig";
import { NewApplicantType } from "../../_service/types";

export function useApplicantActions(applicant: NewApplicantType) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);

  const executeAction = async (actionType: ActionType) => {
    const config = ACTION_CONFIG[actionType];
    setIsLoading(true);

    try {
      // Execute the main action
      await config.action(applicant.id);

      // Execute the email action if it exists
      if (config.emailAction) {
        await config.emailAction(applicant.email);
      }

      setIsDialogOpen(false);
      setCurrentAction(null);

      toast({
        title: config.successTitle,
        description: config.successMessage(applicant.first_name, applicant.last_name),
      });
    } catch (error) {
      console.error(`Error executing ${actionType} action:`, error);
      toast({
        title: "Error",
        description: config.errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmationDialog = (actionType: ActionType) => {
    setCurrentAction(actionType);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentAction(null);
  };

  return {
    isLoading,
    isDialogOpen,
    currentAction,
    executeAction,
    openConfirmationDialog,
    closeDialog,
  };
}