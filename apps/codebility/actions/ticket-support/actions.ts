"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { requireUser } from "@/lib/server/auth-guard";

interface SubmitTicketData {
  userId: string | null;
  fullName: string;
  email: string | null;
  rolePosition: string;
  projectId: string | null;
  assignedTeam: string;
  ticketType: string;
  otherType: string;
  subject: string;
  message: string;
  priority: string;
}

export async function submitTicket(data: SubmitTicketData) {
  const { user, supabase } = await requireUser();

  // Generate a ticket number: TIC-XXXXX
  const ticketNumber = `TIC-${Math.floor(10000 + Math.random() * 90000)}`;

  const { error } = await supabase.from("ticket_support").insert({
    ticket_number: ticketNumber,
    user_id: user.id,
    full_name: data.fullName,
    email: data.email || null,
    role_position: data.rolePosition || null,
    project_id: data.projectId === "none" ? null : data.projectId || null,
    assigned_team: data.assignedTeam || null,
    ticket_type: data.ticketType,
    other_type: data.ticketType === "Other" ? data.otherType : null,
    subject: data.subject || null,
    message: data.message,
    priority: data.priority.toUpperCase(),
    status: "PENDING",
  });

  if (error) {
    console.error("Error submitting ticket:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
