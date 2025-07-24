// Types for applicant actions
export type ActionType = 
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
  | "remindToOnboarding";

export interface ActionConfig {
  action: (id: string) => Promise<any>;
  successTitle: string;
  successMessage: (firstName: string, lastName: string) => string;
  errorMessage: string;
  emailAction?: (email: string) => Promise<any>;
  requiresConfirmation: boolean;
  confirmTitle: string;
  confirmDescription: string;
  variant?: "default" | "destructive";
}