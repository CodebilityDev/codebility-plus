"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CheckCircle2,
  LayoutGrid,
  List,
  MessageCircle,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Tag,
  Ticket as TicketIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@codevs/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";
import {
  updateHelpTicketStatus,
  deleteHelpTicket,
  createTicketReply,
  type HelpTicketWithRelations,
} from "../actions";
import { QuestionDetailModal } from "./QuestionDetailModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "sonner";

const statusIconStyles: Record<string, string> = {
  open: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400",
  closed: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

const tabs = [
  { id: "all", label: "All questions" },
  { id: "open", label: "Open" },
  { id: "closed", label: "Answered" },
] as const;

type SortOption = "newest" | "oldest" | "a-z";

function formatTime(iso: string) {
  return new Date(iso)
    .toLocaleString(undefined, { hour: "numeric", minute: "2-digit" })
    .replace(" ", "");
}

function fullName(person: { first_name: string; last_name: string }) {
  return `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim() || "Unknown";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}


type CommunityQuestionsProps = {
  tickets: HelpTicketWithRelations[];
  isAdmin?: boolean;
  currentCodevId: string | null;
  onNewQuestion?: () => void;
  onEditQuestion: (ticket: HelpTicketWithRelations) => void;
  onTicketsChange: () => Promise<void>;
};

export function CommunityQuestions({
  tickets,
  isAdmin = false,
  currentCodevId,
  onNewQuestion,
  onEditQuestion,
  onTicketsChange,
}: CommunityQuestionsProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<"list" | "grid">("list");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HelpTicketWithRelations | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) ?? null,
    [tickets, selectedTicketId]
  );

  const questions = useMemo(() => {
    const filtered = activeTab === "all" ? tickets : tickets.filter((t) => t.status === activeTab);
    return [...filtered].sort((a, b) => {
      if (sort === "a-z") return a.title.localeCompare(b.title);
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return sort === "newest" ? diff : -diff;
    });
  }, [tickets, activeTab, sort]);

  function openDetail(ticket: HelpTicketWithRelations) {
    setSelectedTicketId(ticket.id);
    setIsDetailOpen(true);
  }

  function handleAddReply(html: string) {
    if (!selectedTicketId) return;
    startTransition(async () => {
      const result = await createTicketReply(selectedTicketId, html);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Reply posted");
      await onTicketsChange();
    });
  }

  function handleMarkResolved(ticket: HelpTicketWithRelations) {
    startTransition(async () => {
      const result = await updateHelpTicketStatus(ticket.id, "closed");
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Ticket marked resolved");
      await onTicketsChange();
    });
  }

  function confirmDelete(ticket: HelpTicketWithRelations) {
    setDeleteTarget(ticket);
    setIsDeleteOpen(true);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteHelpTicket(deleteTarget.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setDeleteTarget(null);
      toast.success("Question deleted");
      await onTicketsChange();
    });
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-4 dark:border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 border-b-2 px-3 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <Button
          size="sm"
          className="h-7 w-auto shrink-0 gap-1.5 rounded-full bg-indigo-50 px-3 text-[14px] lg:text-[14px] font-semibold uppercase tracking-wide text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 dark:hover:bg-indigo-950/70"
          onClick={onNewQuestion}
        >
          <Pencil className="h-3 w-3" />
          New Ticket
        </Button>

        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="w-[120px] border-slate-200 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="a-z">A-Z</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-0.5 rounded-md border border-slate-200 p-0.5 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`flex h-7 w-7 items-center justify-center rounded ${
                view === "grid"
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`flex h-7 w-7 items-center justify-center rounded ${
                view === "list"
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto px-4 pb-4 ${
          view === "grid" ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : "space-y-3"
        }`}
      >
        {questions.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-10 text-center dark:border-slate-700">
            <p className="font-medium text-slate-700 dark:text-slate-300">No questions here</p>
            <p className="text-sm text-slate-400 dark:text-slate-500">Nothing matches this filter yet.</p>
          </div>
        ) : (
          questions.map((ticket) => (
            <article
              key={ticket.id}
              onClick={() => openDetail(ticket)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") openDetail(ticket);
              }}
              className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                ticket.status === "closed"
                  ? "border-emerald-300 bg-emerald-50/40 hover:border-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/10 dark:hover:border-emerald-700"
                  : "border-slate-100 hover:border-indigo-200 dark:border-slate-800 dark:hover:border-indigo-800"
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${statusIconStyles[ticket.status]}`}>
                    <TicketIcon className="h-4 w-4" />
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Ticket #{ticket.ticket_number}
                  </span>
                  {ticket.status === "closed" && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Ticket Resolved
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {formatTime(ticket.created_at)}
                  </span>
                  {(isAdmin || ticket.author.id === currentCodevId) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          aria-label="More options"
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        onClick={(e) => e.stopPropagation()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                      >
                        {ticket.author.id === currentCodevId && ticket.status !== "closed" && (
                          <DropdownMenuItem onClick={() => onEditQuestion(ticket)}>
                            Edit
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleMarkResolved(ticket)}
                          disabled={ticket.status === "closed"}
                        >
                          {ticket.status === "closed" ? "Resolved" : "Mark resolved"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(ticket)}
                          className="text-red-600 focus:text-red-600"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <h3 className="mb-1 font-semibold text-slate-800 dark:text-slate-100">{ticket.title}</h3>
              <p className="mb-3 line-clamp-2 text-sm text-slate-400 dark:text-slate-500">
                {stripHtml(ticket.description)}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px]">
                      {initials(fullName(ticket.author))}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {fullName(ticket.author)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
                  {ticket.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      {ticket.tags.join(", ")}
                    </span>
                  )}
                  {ticket.attachments.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Paperclip className="h-3.5 w-3.5" />
                      {ticket.attachments.length}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {ticket.replies.length}
                  </span>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <QuestionDetailModal
        ticket={selectedTicket}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onAddReply={handleAddReply}
        isSubmittingReply={isPending}
        currentCodevId={currentCodevId}
        isAdmin={isAdmin}
        onRepliesChange={onTicketsChange}
      />

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete this question?"
        description={`"${deleteTarget?.title ?? ""}" and all its replies will be permanently removed.`}
        confirmLabel={isPending ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
      />
    </section>
  );
}