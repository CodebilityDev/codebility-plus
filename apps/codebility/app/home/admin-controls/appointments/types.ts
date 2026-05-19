import { z } from "zod";

export const appointmentStatusSchema = z.enum([
    "pending",
    "confirmed",
    "completed",
    "cancelled",
]);

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;

export const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  completed: {
    label: "Completed",
    className: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

export function sanitizeStatus(dbStatus: string | null | undefined): AppointmentStatus {
  if (!dbStatus) return "pending";
  const normalized = dbStatus.toLowerCase().trim();
  const parsed = appointmentStatusSchema.safeParse(normalized);
  return parsed.success ? parsed.data : "pending";
}

// Aligned with codebility.tech/contact step parameters
export interface AppAppointmentRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  company_name: string | null;
  industry: string | null;
  
  // Step 2 Fields
  services_interested?: string | null;
  website_status?: string | null;
  required_features?: string | null;
  referral_source?: string | null;
  interest_rating?: number | null;
  message: string | null; // Mapped from comments/requirements text blocks
  
  // Step 3 Fields
  appointment_date: string | null; // Selected slot timestamp string value
  meeting_type: string | null; // "Zoom" | "Google Meet"
  meeting_tool_other?: string | null;
  status: string | null;
  created_at: string;
}