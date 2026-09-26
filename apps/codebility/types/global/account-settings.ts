export interface Factor {
  id: string;
  status: "verified" | "unverified";
  friendly_name?: string;
  factor_type: string;
}

export type AccountSettingsBackdropProps = {
  isOpen: boolean;
};

export type DeleteConfirmation = "DELETE";

export type EmptyString = "";

export type FormConfirmation = DeleteConfirmation | EmptyString;

export interface UserDeletionFormValues {
  confirmation: FormConfirmation;
}

export interface AccountSettingsUsernameProps {
  userId: string;
}
