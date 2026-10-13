import type { CurrentUserProfile } from "@/types/global/current-user";

export interface AccountSettings2FAProps {
  mfaFactors: MfaFactor[];
}

export interface AccountSettingsContentProps {
  user: CurrentUserProfile | null;
  mfaFactors: MfaFactor[];
}

export interface MfaFactor {
  id: string;
  status: string;
  friendly_name: string | null;
}

export interface Factor {
  id: string;
  status: "verified" | "unverified";
  friendly_name?: string;
  factor_type: string;
}

export interface AccountSettingsBackdropProps {
  isOpen: boolean;
}

export type DeleteConfirmation = "DELETE";

export type EmptyString = "";

export type FormConfirmation = DeleteConfirmation | EmptyString;

export interface UserDeletionFormValues {
  confirmation: FormConfirmation;
}

export interface UsernameRecord {
  username: string;
  cooldownDays: number;
}

export interface AccountSettingsUsernameProps {
  userId: string;
}

export interface AccountSettingsHeaderProps {
  email: string;
}