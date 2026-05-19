"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatus } from "../actions";
import { format } from "date-fns";
import { toast } from "sonner";

// Fixed imports to use the correct project design system alias paths
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@codevs/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@codevs/ui/select";

import { 
  sanitizeStatus, 
  STATUS_CONFIG, 
  appointmentStatusSchema, 
  type AppointmentStatus, 
  type AppAppointmentRow 
} from "../types";
import { AppointmentDetailSidebar } from "./AppointmentDetailSidebar";
import { Eye } from "lucide-react";

export function AppointmentTable({ initialData }: { initialData: AppAppointmentRow[] }) {
  const queryClient = useQueryClient();
  
  // Track open state for sliding detail panel drawer
  const [selectedAppointment, setSelectedAppointment] = useState<AppAppointmentRow | null>(null);

  // Rewritten mutation block securely running your server action instead of client-side queries
  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      const response = await updateAppointmentStatus(id, status);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to update appointment status");
      }
      
      return response;
    },
    onSuccess: () => {
      toast.success("Appointment status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to alter status bounds");
    },
  });

  if (initialData.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-800 bg-neutral-900/20 text-center p-6">
        <p className="font-medium text-neutral-400">No appointments found</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-900/60">
            <TableRow className="border-neutral-800 hover:bg-transparent">
              <TableHead className="text-neutral-400 font-medium">Client Info</TableHead>
              <TableHead className="text-neutral-400 font-medium">Enterprise Scope</TableHead>
              <TableHead className="text-neutral-400 font-medium">Meeting Schedule</TableHead>
              <TableHead className="text-neutral-400 font-medium w-[160px]">Status</TableHead>
              <TableHead className="text-neutral-400 font-medium w-[60px] text-center">Inspect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((row) => {
              const cleanStatus = sanitizeStatus(row.status);
              const statusStyle = STATUS_CONFIG[cleanStatus];
              const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ") || "Prospect Lead";

              return (
                <TableRow 
                  key={row.id} 
                  className="border-neutral-800/60 hover:bg-neutral-900/20 transition-colors group cursor-pointer"
                  onClick={() => setSelectedAppointment(row)}
                >
                  <TableCell className="py-4">
                    <div className="font-semibold text-neutral-200 group-hover:text-purple-400 transition-colors">{fullName}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{row.email || "No email provided"}</div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="text-sm font-medium text-neutral-300 max-w-[240px] truncate">
                      {row.company_name || "Private Entity"}
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5 flex gap-1 items-center">
                      <span className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400 capitalize">
                        {row.services_interested || "Web Dev"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-neutral-400 py-4">
                    <div className="text-neutral-300 font-medium text-xs">
                      {row.appointment_date 
                        ? format(new Date(row.appointment_date), "MMM dd, yyyy • hh:mm a")
                        : "Date Drop-off"}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5 capitalize">Channel: {row.meeting_type || "Zoom"}</div>
                  </TableCell>

                  {/* Stop row select propagation click event behavior strictly for state mutation selections */}
                  <TableCell className="py-4" onClick={(e) => e.stopPropagation()}>
                    <Select
                      defaultValue={cleanStatus}
                      disabled={isPending}
                      onValueChange={(val) => updateStatus({ id: row.id, status: val as AppointmentStatus })}
                    >
                      <SelectTrigger className={`h-8 w-full border text-xs font-semibold rounded-lg shadow-sm ${statusStyle.className}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-950 border-neutral-800 text-neutral-200">
                        {appointmentStatusSchema.options.map((option) => (
                          <SelectItem key={option} value={option} className="text-xs capitalize focus:bg-neutral-800 focus:text-white cursor-pointer">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <button className="p-1.5 rounded-md border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all shadow-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Slideout Detailed Panel Layer Drawer Trigger */}
      <AppointmentDetailSidebar 
        appointment={selectedAppointment}
        isOpen={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
      />
    </>
  );
}