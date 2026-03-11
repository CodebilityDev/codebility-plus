"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { TicketSupport } from "../types";
import TicketDataTable from "./TicketDataTable";
import TicketPreviewSidebar from "./TicketPreviewSidebar";
import { useNavStore } from "@/hooks/use-sidebar";

interface TicketManagementViewProps {
  initialTickets: TicketSupport[];
  codevList: { id: string; name: string; image_url: string | null }[];
}

type SortField = "created_at" | "priority" | "status" | "ticket_number" | "assigned_to";
type SortDirection = "asc" | "desc";

const PRIORITY_ORDER: Record<string, number> = {
  URGENT: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const STATUS_ORDER: Record<string, number> = {
  PENDING: 1,
  OPEN: 2,
  IN_PROGRESS: 3,
  RESOLVED: 4,
  CLOSED: 5,
};

export default function TicketManagementView({
  initialTickets,
  codevList,
}: TicketManagementViewProps) {
  const router = useRouter();
  const { closeNav, toggleNav, isToggleOpen } = useNavStore(); 
  const [selectedTicket, setSelectedTicket] = useState<TicketSupport | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>("ALL");

  const [wasSidebarOpen, setWasSidebarOpen] = useState(false);

  
  useEffect(() => {
    if (selectedTicket) {
      const updated = initialTickets.find((t) => t.id === selectedTicket.id);
      if (updated) {
       
        setSelectedTicket(updated);
      } else {
        
        handleCloseSidebar();
      }
    }
  }, [initialTickets]);

  const filteredAndSortedTickets = useMemo(() => {
    let result = [...initialTickets];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.ticket_number.toLowerCase().includes(query) ||
          (t.subject || "").toLowerCase().includes(query) ||
          t.full_name.toLowerCase().includes(query) ||
          t.ticket_type.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== "ALL") {
      result = result.filter((t) => t.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== "ALL") {
      result = result.filter((t) => t.priority === filterPriority);
    }

    // Assigned To filter
    if (filterAssignedTo !== "ALL") {
      if (filterAssignedTo === "UNASSIGNED") {
        result = result.filter((t) => !t.assigned_to);
      } else {
        result = result.filter((t) => t.assigned_to === filterAssignedTo);
      }
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "priority":
          comparison = (PRIORITY_ORDER[a.priority] || 0) - (PRIORITY_ORDER[b.priority] || 0);
          break;
        case "status":
          comparison = (STATUS_ORDER[a.status] || 0) - (STATUS_ORDER[b.status] || 0);
          break;
        case "ticket_number":
          comparison = a.ticket_number.localeCompare(b.ticket_number);
          break;
        case "assigned_to":
          comparison = (a.assigned_to_name || "").localeCompare(b.assigned_to_name || "");
          break;
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });

    return result;
  }, [initialTickets, searchQuery, sortField, sortDirection, filterStatus, filterPriority, filterAssignedTo]);

  const handleTicketSelect = (ticket: TicketSupport) => {
    setSelectedTicket(ticket);
    setWasSidebarOpen(isToggleOpen);
    if (isToggleOpen) {
      closeNav(); 
    }
  };

  const handleCloseSidebar = () => {
    setSelectedTicket(null);
    if (wasSidebarOpen && !isToggleOpen) {
      toggleNav(); 
    }
  };

  const handleTicketUpdated = () => {
    // Trigger server-side re-fetch of data
    router.refresh();
  };

  return (
    <div className="relative flex min-h-[600px]">
      {/* Main Table Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          selectedTicket ? "pr-0 lg:pr-[420px]" : ""
        }`}
      >
        <TicketDataTable
          tickets={filteredAndSortedTickets}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(field) => {
            const f = field as SortField;
            if (f === sortField) {
              setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
            } else {
              setSortField(f);
              setSortDirection("desc");
            }
          }}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          filterPriority={filterPriority}
          onFilterPriorityChange={setFilterPriority}
          filterAssignedTo={filterAssignedTo}
          onFilterAssignedToChange={setFilterAssignedTo}
          codevList={codevList}
          selectedTicketId={selectedTicket?.id || null}
          onTicketSelect={handleTicketSelect}
        />
      </div>

      {/* Overlay for clicking outside */}
      {selectedTicket && (
        <div
          className="fixed inset-0 z-[40] bg-black/5 dark:bg-black/20"
        />
      )}

      {/* Preview Sidebar */}
      {selectedTicket && (
        <TicketPreviewSidebar
          ticket={selectedTicket}
          codevList={codevList}
          onClose={handleCloseSidebar}
          onUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
}
