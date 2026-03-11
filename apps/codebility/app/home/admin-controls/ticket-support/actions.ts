"use server";

import { createClientServerComponent } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { TicketSupport, TicketStatus, TicketPriority } from "./types";

export async function getTickets(): Promise<TicketSupport[]> {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("ticket_support")
    .select(
      `
      *,
      assigned_codev:assigned_to (
        id,
        first_name,
        last_name,
        image_url
      ),
      project:project_id (
        id,
        name
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }

  return (data || []).map((ticket: any) => ({
    ...ticket,
    assigned_to_name: ticket.assigned_codev
      ? `${ticket.assigned_codev.first_name} ${ticket.assigned_codev.last_name}`
      : null,
    assigned_to_image: ticket.assigned_codev?.image_url || null,
    project_name: ticket.project?.name || null,
    assigned_codev: undefined,
    project: undefined,
  }));
}

export async function getCodevList(): Promise<
  { id: string; name: string; image_url: string | null }[]
> {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("codev")
    .select("id, first_name, last_name, image_url")
    .order("first_name", { ascending: true });

  if (error) {
    console.error("Error fetching codev list:", error);
    return [];
  }

  return (data || []).map((codev: any) => ({
    id: codev.id,
    name: `${codev.first_name} ${codev.last_name}`.trim(),
    image_url: codev.image_url || null,
  }));
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  const supabase = await createClientServerComponent();

  const { data, error, count } = await supabase
    .from("ticket_support")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .select();

  console.log("[updateTicketStatus]", { ticketId, status, data, error, count });

  if (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    console.error("No rows updated - possible RLS issue. TicketId:", ticketId);
    return { success: false, error: "No rows updated. Check RLS policies on ticket_support table." };
  }

  revalidatePath("/home/admin-controls/ticket-support");
  return { success: true };
}

export async function updateTicketPriority(
  ticketId: string,
  priority: TicketPriority
) {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("ticket_support")
    .update({ priority, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .select();

  console.log("[updateTicketPriority]", { ticketId, priority, data, error });

  if (error) {
    console.error("Error updating ticket priority:", error);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    console.error("No rows updated - possible RLS issue. TicketId:", ticketId);
    return { success: false, error: "No rows updated. Check RLS policies on ticket_support table." };
  }

  revalidatePath("/home/admin-controls/ticket-support");
  return { success: true };
}

export async function updateTicketAssignment(
  ticketId: string,
  assignedToId: string | null
) {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("ticket_support")
    .update({ assigned_to: assignedToId, updated_at: new Date().toISOString() })
    .eq("id", ticketId)
    .select();

  console.log("[updateTicketAssignment]", { ticketId, assignedToId, data, error });

  if (error) {
    console.error("Error updating ticket assignment:", error);
    return { success: false, error: error.message };
  }

  if (!data || data.length === 0) {
    console.error("No rows updated - possible RLS issue. TicketId:", ticketId);
    return { success: false, error: "No rows updated. Check RLS policies on ticket_support table." };
  }

  revalidatePath("/home/admin-controls/ticket-support");
  return { success: true };
}

export async function deleteTicket(ticketId: string) {
  const supabase = await createClientServerComponent();

  // First verify the ticket exists
  const { data: existing } = await supabase
    .from("ticket_support")
    .select("id")
    .eq("id", ticketId)
    .single();

  console.log("[deleteTicket] existing:", existing);

  if (!existing) {
    return { success: false, error: "Ticket not found or no read access (RLS)." };
  }

  const { error, count } = await supabase
    .from("ticket_support")
    .delete()
    .eq("id", ticketId);

  console.log("[deleteTicket]", { ticketId, error, count });

  if (error) {
    console.error("Error deleting ticket:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/home/admin-controls/ticket-support");
  return { success: true };
}
