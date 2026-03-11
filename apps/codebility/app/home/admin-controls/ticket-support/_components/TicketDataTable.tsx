"use client";


import { Search, ChevronDown, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TicketSupport, TicketStatus, TicketPriority } from "../types";
import {
  STATUS_COLORS,
  PRIORITY_COLORS,
  TYPE_COLORS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
} from "../types";
import { useState, useRef, useEffect } from "react";

interface TicketDataTableProps {
  tickets: TicketSupport[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (priority: string) => void;
  filterAssignedTo: string;
  onFilterAssignedToChange: (assignedTo: string) => void;
  codevList: { id: string; name: string; image_url: string | null }[];
  selectedTicketId: string | null;
  onTicketSelect: (ticket: TicketSupport) => void;
}

function DropdownMenu({
  trigger,
  children,
  align = "right",
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute top-full mt-1 z-50 min-w-[160px] max-h-[300px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 ${
            align === "right" ? "right-0" : "left-0"
          }`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
        active
          ? "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400"
          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function TicketDataTable({
  tickets,
  searchQuery,
  onSearchChange,
  sortField,
  sortDirection,
  onSortChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  filterAssignedTo,
  onFilterAssignedToChange,
  codevList,
  selectedTicketId,
  onTicketSelect,
}: TicketDataTableProps) {
  const activeFilterCount =
    (filterStatus !== "ALL" ? 1 : 0) + 
    (filterPriority !== "ALL" ? 1 : 0) +
    (filterAssignedTo !== "ALL" ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Sort By */}
          <DropdownMenu
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-zinc-600 dark:hover:text-white">
                <ArrowUpDown className="h-4 w-4" />
                Sort by
                <ChevronDown className="h-3 w-3" />
              </button>
            }
          >
            <DropdownItem
              active={sortField === "created_at"}
              onClick={() => onSortChange("created_at")}
            >
              Date {sortField === "created_at" && (sortDirection === "desc" ? "↓" : "↑")}
            </DropdownItem>
            <DropdownItem
              active={sortField === "priority"}
              onClick={() => onSortChange("priority")}
            >
              Priority {sortField === "priority" && (sortDirection === "desc" ? "↓" : "↑")}
            </DropdownItem>
            <DropdownItem
              active={sortField === "status"}
              onClick={() => onSortChange("status")}
            >
              Status {sortField === "status" && (sortDirection === "desc" ? "↓" : "↑")}
            </DropdownItem>
            <DropdownItem
              active={sortField === "ticket_number"}
              onClick={() => onSortChange("ticket_number")}
            >
              Ticket # {sortField === "ticket_number" && (sortDirection === "desc" ? "↓" : "↑")}
            </DropdownItem>
          </DropdownMenu>

          {/* Filter */}
          <DropdownMenu
            trigger={
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:border-zinc-600 dark:hover:text-white">
                <SlidersHorizontal className="h-4 w-4" />
                Filter
                {activeFilterCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs text-white">
                    {activeFilterCount}
                  </span>
                )}
                <ChevronDown className="h-3 w-3" />
              </button>
            }
          >
            <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-500">
              Status
            </div>
            <DropdownItem
              active={filterStatus === "ALL"}
              onClick={() => onFilterStatusChange("ALL")}
            >
              All Statuses
            </DropdownItem>
            {TICKET_STATUSES.map((s) => (
              <DropdownItem
                key={s}
                active={filterStatus === s}
                onClick={() => onFilterStatusChange(s)}
              >
                {STATUS_LABELS[s]}
              </DropdownItem>
            ))}
            <div className="my-1 h-px bg-gray-100 dark:bg-zinc-700" />
            <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-500">
              Priority
            </div>
            <DropdownItem
              active={filterPriority === "ALL"}
              onClick={() => onFilterPriorityChange("ALL")}
            >
              All Priorities
            </DropdownItem>
            {TICKET_PRIORITIES.map((p) => (
              <DropdownItem
                key={p}
                active={filterPriority === p}
                onClick={() => onFilterPriorityChange(p)}
              >
                {PRIORITY_LABELS[p]}
              </DropdownItem>
            ))}
            <div className="my-1 h-px bg-gray-100 dark:bg-zinc-700" />
            <div className="px-2 py-1 text-xs font-semibold uppercase text-gray-500">
              Assigned To
            </div>
            <DropdownItem
              active={filterAssignedTo === "ALL"}
              onClick={() => onFilterAssignedToChange("ALL")}
            >
              All Support
            </DropdownItem>
            <DropdownItem
              active={filterAssignedTo === "UNASSIGNED"}
              onClick={() => onFilterAssignedToChange("UNASSIGNED")}
            >
              Unassigned
            </DropdownItem>
            {codevList.map((c) => (
              <DropdownItem
                key={c.id}
                active={filterAssignedTo === c.id}
                onClick={() => onFilterAssignedToChange(c.id)}
              >
                {c.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden dark:border-zinc-800 dark:bg-zinc-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent dark:border-zinc-800 whitespace-nowrap">
              <TableHead className="text-sm font-medium text-gray-400">Ticket ID #</TableHead>
              <TableHead className="text-sm font-medium text-gray-400">Ticket Title</TableHead>
              <TableHead className="text-sm font-medium text-gray-400">Submitted by</TableHead>
              <TableHead className="text-sm font-medium text-gray-400">Priority</TableHead>
              <TableHead className="text-sm font-medium text-gray-400">Type</TableHead>
              <TableHead className="text-sm font-medium text-gray-400">Status</TableHead>
              <TableHead className="text-sm font-medium text-gray-400">Assigned To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Search className="h-8 w-8" />
                    <p className="text-sm">No tickets found</p>
                    {(searchQuery || filterStatus !== "ALL" || filterPriority !== "ALL") && (
                      <p className="text-xs">Try adjusting your search or filters</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => {
                const statusColor = STATUS_COLORS[ticket.status as TicketStatus] || STATUS_COLORS.PENDING;
                const priorityColor = PRIORITY_COLORS[ticket.priority as TicketPriority] || PRIORITY_COLORS.MEDIUM;
                const typeColor = TYPE_COLORS[ticket.ticket_type] || TYPE_COLORS["Other"] || { bg: "bg-gray-500/20", text: "text-gray-400" };
                const isSelected = selectedTicketId === ticket.id;

                return (
                  <TableRow
                    key={ticket.id}
                    className={`cursor-pointer border-b border-gray-50 transition-all duration-150 dark:border-zinc-800/50 ${
                      isSelected
                        ? "bg-violet-500/5 hover:bg-violet-500/10 dark:bg-violet-500/10 dark:hover:bg-violet-500/15"
                        : "hover:bg-gray-50/50 dark:hover:bg-zinc-800/50"
                    }`}
                    onClick={() => onTicketSelect(ticket)}
                  >
                    <TableCell className="text-sm font-mono whitespace-nowrap text-gray-500 dark:text-gray-400">
                      {ticket.ticket_number}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-200 max-w-[150px] md:max-w-[200px] lg:max-w-[250px] xl:max-w-sm truncate">
                      {ticket.subject || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 overflow-hidden text-xs font-medium text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                          {ticket.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px] md:max-w-[140px] xl:max-w-none">
                          {ticket.full_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${priorityColor.bg} ${priorityColor.text}`}
                      >
                        {PRIORITY_LABELS[ticket.priority as TicketPriority] || ticket.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${typeColor.bg} ${typeColor.text}`}
                      >
                        {ticket.ticket_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${statusColor.bg} ${statusColor.text}`}
                      >
                        {STATUS_LABELS[ticket.status as TicketStatus] || ticket.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         {ticket.assigned_to_name ? (
                           <>
                             <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 overflow-hidden text-[10px] font-medium text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                               {ticket.assigned_to_image ? (
                                 <img
                                   src={ticket.assigned_to_image}
                                   alt={ticket.assigned_to_name}
                                   className="h-full w-full object-cover"
                                 />
                               ) : (
                                 ticket.assigned_to_name
                                   .split(" ")
                                   .map((n) => n[0])
                                   .join("")
                                   .toUpperCase()
                                   .slice(0, 2)
                               )}
                             </div>
                             <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[100px] md:max-w-[140px] xl:max-w-none">
                               {ticket.assigned_to_name}
                             </span>
                           </>
                         ) : (
                           <span className="text-sm text-gray-400">Unassigned</span>
                         )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">
        {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} found
      </div>
    </div>
  );
}
