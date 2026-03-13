// Types for Ticket Management System

export interface TicketSupport {
  id: string;
  ticket_number: string;
  user_id: string | null;
  full_name: string;
  email: string | null;
  role_position: string | null;
  project_id: string | null;
  assigned_team: string | null;
  ticket_type: string;
  other_type: string | null;
  subject: string | null;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
  // Joined fields
  assigned_to_name?: string | null;
  assigned_to_image?: string | null;
  project_name?: string | null;
  submitter_image?: string | null;
}

export type TicketStatus = "PENDING" | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export const TICKET_STATUSES: TicketStatus[] = [
  "PENDING",
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export const TICKET_PRIORITIES: TicketPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

export const STATUS_COLORS: Record<TicketStatus, { bg: string; text: string }> = {
  PENDING: { bg: "bg-gray-500/20", text: "text-gray-400" },
  OPEN: { bg: "bg-blue-500/20", text: "text-blue-400" },
  IN_PROGRESS: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  RESOLVED: { bg: "bg-green-500/20", text: "text-green-400" },
  CLOSED: { bg: "bg-zinc-600/20", text: "text-zinc-500" },
};

export const PRIORITY_COLORS: Record<TicketPriority, { bg: string; text: string }> = {
  LOW: { bg: "bg-green-500/20", text: "text-green-400" },
  MEDIUM: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  HIGH: { bg: "bg-orange-500/20", text: "text-orange-400" },
  URGENT: { bg: "bg-red-500/20", text: "text-red-400" },
};

export const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "Bug Report": { bg: "bg-red-500/20", text: "text-red-400" },
  "Feature Request": { bg: "bg-purple-500/20", text: "text-purple-400" },
  "Access Issue": { bg: "bg-orange-500/20", text: "text-orange-400" },
  "UI/UX Issue": { bg: "bg-pink-500/20", text: "text-pink-400" },
  "Performance Issue": { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  "Account Issue": { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  Other: { bg: "bg-gray-500/20", text: "text-gray-400" },
};

export const STATUS_LABELS: Record<TicketStatus, string> = {
  PENDING: "Pending",
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};
