"use server";

import { revalidatePath } from "next/cache";
import { createClientServerComponent } from "@/utils/supabase/server";

export type FaqItemRow = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const HELP_CENTER_PATH = "/help-center"; // adjust to your actual route

// ---- Read ----

export async function getFaqItems() {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getFaqItems error:", error);
    return { data: null, error: error.message };
  }

  return { data: data as FaqItemRow[], error: null };
}

// ---- Create ----

export type CreateFaqItemInput = {
  category: string;
  question: string;
  answer: string;
};

export async function createFaqItem(input: CreateFaqItemInput) {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("faq_items")
    .insert({
      category: input.category,
      question: input.question,
      answer: input.answer,
    })
    .select()
    .single();

  if (error) {
    console.error("createFaqItem error:", error);
    return { data: null, error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as FaqItemRow, error: null };
}

// ---- Update ----

export type UpdateFaqItemInput = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export async function updateFaqItem(input: UpdateFaqItemInput) {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("faq_items")
    .update({
      category: input.category,
      question: input.question,
      answer: input.answer,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    console.error("updateFaqItem error:", error);
    return { data: null, error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as FaqItemRow, error: null };
}

// ---- Delete ----

export async function deleteFaqItem(id: string) {
  const supabase = await createClientServerComponent();

  const { error } = await supabase.from("faq_items").delete().eq("id", id);

  if (error) {
    console.error("deleteFaqItem error:", error);
    return { error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { error: null };
}

// ---- Types ----

export type HelpTicketRow = {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  author_id: string;
  status: "open" | "closed";
  tags: string[];
  created_at: string;
  updated_at: string;
};

export type HelpTicketReplyRow = {
  id: string;
  ticket_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type HelpTicketAttachmentRow = {
  id: string;
  ticket_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  uploaded_by: string;
  created_at: string;
};

export async function uploadTicketAttachment(ticketId: string, file: File) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const filePath = `help-ticket-attachments/${ticketId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("codebility")
    .upload(filePath, file);

  if (uploadError) {
    console.error("uploadTicketAttachment storage error:", uploadError);
    return { data: null, error: uploadError.message };
  }

  const { data, error: insertError } = await supabase
    .from("help_ticket_attachments")
    .insert({
      ticket_id: ticketId,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (insertError) {
    console.error("uploadTicketAttachment db error:", insertError);
    await supabase.storage.from("codebility").remove([filePath]);
    return { data: null, error: insertError.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as HelpTicketAttachmentRow, error: null };
}

export async function getTicketAttachmentUrl(filePath: string) {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase.storage
    .from("codebility")
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    console.error("getTicketAttachmentUrl error:", error);
    return { url: null, error: error.message };
  }

  return { url: data.signedUrl, error: null };
}

export async function deleteTicketAttachment(id: string, filePath: string) {
  const supabase = await createClientServerComponent();

  const { error: storageError } = await supabase.storage
    .from("codebility")
    .remove([filePath]);

  if (storageError) {
    console.error("deleteTicketAttachment storage error:", storageError);
    return { error: storageError.message };
  }

  const { error: dbError } = await supabase
    .from("help_ticket_attachments")
    .delete()
    .eq("id", id);

  if (dbError) {
    console.error("deleteTicketAttachment db error:", dbError);
    return { error: dbError.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { error: null };
}

// Shape used by the UI — ticket + joined author + replies + attachments,
// since the components render all of this together.
export type HelpTicketWithRelations = HelpTicketRow & {
  author: { id: string; first_name: string; last_name: string };
  replies: (HelpTicketReplyRow & {
    author: { id: string; first_name: string; last_name: string };
  })[];
  attachments: HelpTicketAttachmentRow[];
};

// ---- Read ----

export async function getHelpTickets() {
  const supabase = await createClientServerComponent();

  const { data, error } = await supabase
    .from("help_tickets")
    .select(
      `
      *,
      author:codev!help_tickets_author_id_fkey ( id, first_name, last_name ),
      replies:help_ticket_replies (
        *,
        author:codev!help_ticket_replies_author_id_fkey ( id, first_name, last_name )
      ),
      attachments:help_ticket_attachments ( * )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getHelpTickets error:", error);
    return { data: null, error: error.message };
  }

  return { data: data as unknown as HelpTicketWithRelations[], error: null };
}

// ---- Create ----

export type CreateHelpTicketInput = {
  title: string;
  description: string;
  tags: string[];
};

export async function createHelpTicket(input: CreateHelpTicketInput) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("help_tickets")
    .insert({
      title: input.title,
      description: input.description,
      tags: input.tags,
      author_id: user.id,
      status: "open",
    })
    .select()
    .single();

  if (error) {
    console.error("createHelpTicket error:", error);
    return { data: null, error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as HelpTicketRow, error: null };
}

// ---- Update status ----

export async function updateHelpTicketStatus(
  id: string,
  status: HelpTicketRow["status"]
) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    return { data: null, error: "Could not resolve current user's codev record" };
  }

  const { data: ticket, error: fetchError } = await supabase
    .from("help_tickets")
    .select("author_id")
    .eq("id", id)
    .single();

  if (fetchError || !ticket) {
    return { data: null, error: "Ticket not found" };
  }

  const isAuthor = ticket.author_id === user.id;
  const isAdmin = codev.role_id === 1;

  if (!isAuthor && !isAdmin) {
    return { data: null, error: "You don't have permission to update this ticket" };
  }

  const { data, error } = await supabase
    .from("help_tickets")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateHelpTicketStatus error:", error);
    return { data: null, error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as HelpTicketRow, error: null };
}

// ---- Delete ----

export async function deleteHelpTicket(id: string) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("id, role_id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    return { error: "Could not resolve current user's codev record" };
  }

  const { data: ticket, error: fetchError } = await supabase
    .from("help_tickets")
    .select("author_id")
    .eq("id", id)
    .single();

  if (fetchError || !ticket) {
    return { error: "Ticket not found" };
  }

  const isAuthor = ticket.author_id === codev.id;
  const isAdmin = codev.role_id === 1; // per your RLS audit: Admin=1

  if (!isAuthor && !isAdmin) {
    return { error: "You don't have permission to delete this ticket" };
  }

  const { error } = await supabase.from("help_tickets").delete().eq("id", id);

  if (error) {
    console.error("deleteHelpTicket error:", error);
    return { error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { error: null };
}

// ------- Get current Users ID

export async function getCurrentCodevId() {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    console.error("getCurrentCodevId error:", {
      message: codevError?.message,
      details: codevError?.details,
      hint: codevError?.hint,
      code: codevError?.code,
    });
    return { data: null, error: "Could not resolve current user's codev record" };
  }

  return { data: codev.id as string, error: null };
}

export async function createTicketReply(ticketId: string, content: string) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data: ticket, error: ticketError } = await supabase
    .from("help_tickets")
    .select("status")
    .eq("id", ticketId)
    .single();

  if (ticketError || !ticket) {
      return { data: null, error: "Ticket not found" };
    }

  if (ticket.status === "closed") {
    return { data: null, error: "This ticket is resolved and no longer accepts replies" };
  }
  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    return { data: null, error: "Could not resolve current user's codev record" };
  }

  const { data, error } = await supabase
    .from("help_ticket_replies")
    .insert({ ticket_id: ticketId, author_id: codev.id, content })
    .select()
    .single();

  if (error) {
    console.error("createTicketReply error:", error);
    return { data: null, error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as HelpTicketReplyRow, error: null };
}

// ---- Update ticket content (title/description/tags) ----

export type UpdateHelpTicketInput = {
  id: string;
  title: string;
  description: string;
  tags: string[];
};

export async function updateHelpTicket(input: UpdateHelpTicketInput) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    return { data: null, error: "Could not resolve current user's codev record" };
  }

  const { data: ticket, error: fetchError } = await supabase
    .from("help_tickets")
    .select("author_id, status")
    .eq("id", input.id)
    .single();

  if (fetchError || !ticket) {
    return { data: null, error: "Ticket not found" };
  }

  const isAuthor = ticket.author_id === user.id;
  const isAdmin = codev.role_id === 1;

  if (!isAuthor && !isAdmin) {
    return { data: null, error: "You don't have permission to edit this ticket" };
  }

  if (ticket.status === "closed") {
    return { data: null, error: "This ticket is resolved and can no longer be edited" };
  }

  const { data, error } = await supabase
    .from("help_tickets")
    .update({
      title: input.title,
      description: input.description,
      tags: input.tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.id)
    .select()
    .single();

  if (error) {
    console.error("updateHelpTicket error:", error);
    return { data: null, error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as HelpTicketRow, error: null };
}

// ----- Edit Reply

export async function updateTicketReply(id: string, content: string) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data: reply, error: fetchError } = await supabase
    .from("help_ticket_replies")
    .select("author_id")
    .eq("id", id)
    .single();

  if (fetchError || !reply) {
    return { data: null, error: "Reply not found" };
  }

  if (reply.author_id !== user.id) {
    return { data: null, error: "You can only edit your own replies" };
  }

  const { data, error } = await supabase
    .from("help_ticket_replies")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateTicketReply error:", error);
    return { data: null, error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { data: data as HelpTicketReplyRow, error: null };
}

export async function deleteTicketReply(id: string) {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }

  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    return { error: "Could not resolve current user's codev record" };
  }

  const { data: reply, error: fetchError } = await supabase
    .from("help_ticket_replies")
    .select("author_id")
    .eq("id", id)
    .single();

  if (fetchError || !reply) {
    return { error: "Reply not found" };
  }

  const isAuthor = reply.author_id === user.id;
  const isAdmin = codev.role_id === 1;

  if (!isAuthor && !isAdmin) {
    return { error: "You don't have permission to delete this reply" };
  }

  const { error } = await supabase.from("help_ticket_replies").delete().eq("id", id);

  if (error) {
    console.error("deleteTicketReply error:", error);
    return { error: error.message };
  }

  revalidatePath(HELP_CENTER_PATH);
  return { error: null };
}

// --- Get current user's role (for admin check) ----

export async function getCurrentUserRole() {
  const supabase = await createClientServerComponent();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (codevError || !codev) {
    return { data: null, error: "Could not resolve current user's codev record" };
  }

  return { data: codev.role_id as number, error: null };
}

