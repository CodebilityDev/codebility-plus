"use client";

import { useState, useTransition } from "react";
import { User, Mail, Briefcase, Folder, Clock, MessageSquare, Trash2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type { TicketSupport, TicketStatus, TicketPriority } from "../types";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
} from "../types";
import {
  updateTicketStatus,
  updateTicketPriority,
  updateTicketAssignment,
  deleteTicket,
} from "../actions";

interface TicketPreviewSidebarProps {
  ticket: TicketSupport;
  codevList: { id: string; name: string; image_url: string | null }[];
  onClose: () => void;
  onUpdated: () => void;
}

export default function TicketPreviewSidebar({
  ticket,
  codevList,
  onClose,
  onUpdated,
}: TicketPreviewSidebarProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusColor = STATUS_COLORS[ticket.status as TicketStatus] || STATUS_COLORS.PENDING;

  const handleStatusChange = (newStatus: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await updateTicketStatus(ticket.id, newStatus as TicketStatus);
        if (!res.success) {
          setError(`Status update failed: ${res.error}`);
          return;
        }
        onUpdated();
      } catch (err: any) {
        console.error("Failed to update status:", err);
        setError(`Status update failed: ${err.message}`);
      }
    });
  };

  const handlePriorityChange = (newPriority: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await updateTicketPriority(ticket.id, newPriority as TicketPriority);
        if (!res.success) {
          setError(`Priority update failed: ${res.error}`);
          return;
        }
        onUpdated();
      } catch (err: any) {
        console.error("Failed to update priority:", err);
        setError(`Priority update failed: ${err.message}`);
      }
    });
  };

  const handleAssignmentChange = (codevId: string) => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await updateTicketAssignment(
          ticket.id,
          codevId === "unassigned" ? null : codevId
        );
        if (!res.success) {
          setError(`Assignment update failed: ${res.error}`);
          return;
        }
        onUpdated();
      } catch (err: any) {
        console.error("Failed to update assignment:", err);
        setError(`Assignment update failed: ${err.message}`);
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      try {
        const res = await deleteTicket(ticket.id);
        if (!res.success) {
          setError(`Delete failed: ${res.error}`);
          setShowDeleteConfirm(false);
          return;
        }
        setShowDeleteConfirm(false);
        onClose(); // Close sidebar after successful delete
        onUpdated();
      } catch (err: any) {
        console.error("Failed to delete ticket:", err);
        setError(`Delete failed: ${err.message}`);
        setShowDeleteConfirm(false);
      }
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed right-0 top-[64px] bottom-0 z-[45] w-full max-w-[420px] border-l border-gray-200 bg-white shadow-2xl overflow-y-auto dark:border-zinc-800 dark:bg-zinc-950"
      style={{
        animation: "slide-in-right 0.25s ease-out forwards",
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 dark:bg-violet-500/20">
            <MessageSquare className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Ticket Preview</h2>
        </div>
        <div className="flex items-center gap-1">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-red-500 uppercase tracking-wider">
                Confirm Delete?
              </span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isPending ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isPending}
                className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-400 dark:hover:bg-zinc-700"
              >
                No
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                title="Delete Ticket"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white"
                title="Close Preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Error Banner */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-600 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading indicator */}
        {isPending && (
          <div className="rounded-lg bg-violet-50 border border-violet-200 p-3 text-xs text-violet-600 dark:bg-violet-500/10 dark:border-violet-500/30 dark:text-violet-400">
            Updating ticket...
          </div>
        )}

        {/* Ticket Header */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-mono text-gray-500">#{ticket.ticket_number}</p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900 leading-tight dark:text-white">
                {ticket.subject || "No Subject"}
              </h3>
            </div>
            <span
              className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor.bg} ${statusColor.text}`}
            >
              {STATUS_LABELS[ticket.status as TicketStatus]}
            </span>
          </div>
        </div>

        {/* Admin Controls */}
        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Manage Ticket
          </h4>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Status</label>
            <Select
              value={ticket.status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="h-9 border-gray-200 bg-white text-sm text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom" position="popper" sideOffset={4}>
                <SelectGroup>
                  {TICKET_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            STATUS_COLORS[s].text.replace("text-", "bg-")
                          }`}
                        />
                        {STATUS_LABELS[s]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">Priority</label>
            <Select
              value={ticket.priority}
              onValueChange={handlePriorityChange}
              disabled={isPending}
            >
              <SelectTrigger className="h-9 border-gray-200 bg-white text-sm text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom" position="popper" sideOffset={4}>
                <SelectGroup>
                  {TICKET_PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            PRIORITY_COLORS[p].text.replace("text-", "bg-")
                          }`}
                        />
                        {PRIORITY_LABELS[p]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <CustomSelect
            label="Assigned To"
            placeholder="Unassigned"
            searchable
            value={ticket.assigned_to || ""}
            onChange={handleAssignmentChange}
            disabled={isPending}
            options={[
              { id: "unassigned", value: "unassigned", label: "Unassigned" },
              ...codevList.map((codev) => ({
                id: codev.id,
                value: codev.id,
                label: codev.name,
                imageUrl: codev.image_url,
              })),
            ]}
          />
        </div>

        {/* Submitter Info */}
        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Submitted By
          </h4>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 overflow-hidden text-sm font-medium text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
              {ticket.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">{ticket.full_name}</p>
                {ticket.user_id ? (
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                    Member
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-500/10 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400">
                    Guest
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{ticket.email}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Role" value={ticket.role_position || "—"} />
            <InfoRow icon={<Folder className="h-4 w-4" />} label="Project" value={ticket.project_name || "—"} />
            {ticket.assigned_team && (
              <InfoRow icon={<User className="h-4 w-4" />} label="Team" value={ticket.assigned_team} />
            )}
          </div>
        </div>

        {/* Ticket Details */}
        <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Ticket Details
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
              <span className="text-gray-600 dark:text-gray-400">
                {ticket.ticket_type}
                {ticket.other_type ? ` — ${ticket.other_type}` : ""}
              </span>
            </div>
            <div className="mt-2 rounded-lg bg-white p-3 border border-gray-100 dark:bg-zinc-800/50 dark:border-none">
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                {ticket.message}
              </p>
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="space-y-2 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-400 dark:text-gray-500">Created:</span>
              <span className="text-gray-600 dark:text-gray-300">{formatDate(ticket.created_at)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-400 dark:text-gray-500">Updated:</span>
              <span className="text-gray-600 dark:text-gray-300">{formatDate(ticket.updated_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inline animation style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-gray-500">{icon}</span>
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-gray-400 dark:text-gray-500">{label}:</span>
        <span className="text-gray-600 dark:text-gray-300">{value}</span>
      </div>
    </div>
  );
}
