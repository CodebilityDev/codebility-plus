// ─── Request body type ─────────────────────────────────────────────────────

export interface AppointmentBody {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  industry: string;
  serviceInterest: string;
  projectType: string;
  featuresNeeded: string;
  referralSource: string;
  interestLevel: number;
  otherRequirements: string;
  appointmentDate: string;
  appointmentTime: string;
  meetingType: string;
  meetingToolOther: string | null;
}
