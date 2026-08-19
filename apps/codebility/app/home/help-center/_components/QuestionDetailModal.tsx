"use client";

import { useState } from "react";
import {
  Clock,
  Download,
  FileText,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Ticket as TicketIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@codevs/ui/avatar";
import type { HelpTicketWithRelations, HelpTicketRow } from "../actions";
import { updateTicketReply, deleteTicketReply, getTicketAttachmentUrl } from "../actions";
import { CommentEditor } from "./CommentEditor";
import { toast } from "sonner";

const statusIconStyles: Record<HelpTicketRow["status"], string> = {
  open: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  answered: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  closed: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const statusPillStyles: Record<HelpTicketRow["status"], string> = {
  open: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400",
  answered: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
  closed: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const statusLabels: Record<HelpTicketRow["status"], string> = {
  open: "Open",
  answered: "Answered",
  closed: "Closed",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function fullName(person: { first_name: string; last_name: string }) {
  return `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() || "Unknown";
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type QuestionDetailModalProps = {
  ticket: HelpTicketWithRelations | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReply?: (html: string) => void;
  isSubmittingReply?: boolean;
  currentCodevId: string | null;
  isAdmin?: boolean;
  onRepliesChange?: () => Promise<void>;
};

export function QuestionDetailModal({
  ticket,
  open,
  onOpenChange,
  onAddReply,
  isSubmittingReply = false,
  currentCodevId,
  isAdmin = false,
  onRepliesChange,
}: QuestionDetailModalProps) {
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [isReplyBusy, setIsReplyBusy] = useState(false);

  if (!ticket) return null;

  const isTicketClosed = ticket.status === "closed";

  async function handleOpenAttachment(
    attachment: HelpTicketWithRelations["attachments"][number]
  ) {
    setOpeningId(attachment.id);
    const { url, error } = await getTicketAttachmentUrl(attachment.file_path);
    setOpeningId(null);

    if (error || !url) {
      console.error("Failed to get attachment URL:", error);
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0 lg:max-w-5xl">
        <DialogHeader className="border-b border-slate-100 p-6 pb-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${statusIconStyles[ticket.status]}`}
            >
              <TicketIcon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span>Ticket #{ticket.ticket_number}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${statusPillStyles[ticket.status]}`}
                >
                  {statusLabels[ticket.status]}
                </span>
              </div>
              <DialogTitle className="text-lg leading-snug">
                {ticket.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed text-slate-700 dark:text-slate-200"
              dangerouslySetInnerHTML={{ __html: ticket.description }}
            />

            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 ring-2 ring-indigo-50 dark:ring-indigo-950">
                  <AvatarFallback className="text-[11px]">
                    {initials(fullName(ticket.author))}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-slate-600 dark:text-slate-300">
                  {fullName(ticket.author)}
                </span>
              </div>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Clock className="h-3.5 w-3.5" />
                {formatDateTime(ticket.created_at)}
              </span>
            </div>
          </div>

          {ticket.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {ticket.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {ticket.attachments.length > 0 && (
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                {ticket.attachments.length} attachment
                {ticket.attachments.length > 1 ? "s" : ""}
              </div>
              <div className="space-y-1.5">
                {ticket.attachments.map((attachment) => (
                  <button
                    key={attachment.id}
                    type="button"
                    onClick={() => handleOpenAttachment(attachment)}
                    disabled={openingId === attachment.id}
                    className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-100 px-3 py-2 text-left text-sm transition-colors hover:border-indigo-200 hover:bg-indigo-50/40 disabled:opacity-60 dark:border-slate-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/20"
                  >
                    <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FileText className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                      <span className="truncate">{attachment.file_name}</span>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                        {formatFileSize(attachment.file_size)}
                      </span>
                    </span>
                    {openingId === attachment.id ? (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-slate-400" />
                    ) : (
                      <Download className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <MessageCircle className="h-4 w-4 text-indigo-500" />
              {ticket.replies.length} repl
              {ticket.replies.length === 1 ? "y" : "ies"}
            </div>

            {ticket.replies.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                No replies yet.
              </p>
            ) : (
              <div className="space-y-3">
                {ticket.replies.map((reply) => {
                  const isOwnReply = reply.author.id === currentCodevId;
                  const canEdit = isOwnReply && !isTicketClosed;
                  const canDelete = (isOwnReply || isAdmin) && !isTicketClosed;
                  const isEditingThis = editingReplyId === reply.id;

                  async function handleSaveEdit(html: string) {
                    setIsReplyBusy(true);
                    const result = await updateTicketReply(reply.id, html);
                    setIsReplyBusy(false);
                    if (result.error) {
                      console.error("Failed to edit reply:", result.error);
                      toast.error(result.error);
                      return;
                    }
                    setEditingReplyId(null);
                    toast.success("Reply updated");
                    await onRepliesChange?.();
                  }

                  async function handleDeleteReply() {
                    setIsReplyBusy(true);
                    const result = await deleteTicketReply(reply.id);
                    setIsReplyBusy(false);
                    if (result.error) {
                      console.error("Failed to delete reply:", result.error);
                      toast.error(result.error);
                      return;
                    }
                    toast.success("Reply deleted");
                    await onRepliesChange?.();
                  }

                  return (
                    <div
                      key={reply.id}
                      className="flex gap-2.5 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
                    >
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="text-[11px]">
                          {initials(fullName(reply.author))}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {fullName(reply.author)}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {formatDateTime(reply.created_at)}
                              {reply.updated_at !== reply.created_at && (
                                <span className="ml-1 italic">(edited)</span>
                              )}
                            </span>
                          </div>

                          {(canEdit || canDelete) && !isEditingThis && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  type="button"
                                  aria-label="Reply options"
                                  className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {canEdit && (
                                  <DropdownMenuItem onClick={() => setEditingReplyId(reply.id)}>
                                    Edit
                                  </DropdownMenuItem>
                                )}
                                {canDelete && (
                                  <DropdownMenuItem
                                    onClick={handleDeleteReply}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>

                        {isEditingThis ? (
                          <div className="mt-2">
                            <CommentEditor
                              initialValue={reply.content}
                              onSubmit={handleSaveEdit}
                              onCancel={() => setEditingReplyId(null)}
                              submitLabel="Save"
                              isSubmitting={isReplyBusy}
                            />
                          </div>
                        ) : (
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300"
                            dangerouslySetInnerHTML={{ __html: reply.content }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          {isTicketClosed ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
              This ticket has been resolved and is no longer open for replies.
            </div>
          ) : (
            <CommentEditor
              onSubmit={(html) => onAddReply?.(html)}
              placeholder="Write a reply..."
              isSubmitting={isSubmittingReply}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}