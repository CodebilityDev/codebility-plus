export interface EmailRecipient {
  email: string;
  name: string;
}

export interface ApplicantEmailData extends EmailRecipient {
  applicantId: string;
}

export interface EmailConfig {
  from: string;
  cc: string[];
  to: string;
}
