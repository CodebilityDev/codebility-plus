"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateAppointmentStatus } from "../actions";
import { format } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  
  // Track open state for sliding detail panel drawer
  const [selectedAppointment, setSelectedAppointment] = useState<AppAppointmentRow | null>(null);
  const [pendingRowId, setPendingRowId] = useState<string | null>(null);

  // Rewritten mutation block securely running your server action instead of client-side queries
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AppointmentStatus }) => {
      setPendingRowId(id);
      const response = await updateAppointmentStatus(id, status);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to update appointment status");
      }
      
      return response;
    },
    onSuccess: () => {
      toast.success("Appointment status updated successfully");
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update appointment status.");
    },
    onSettled: () => {
      setPendingRowId(null);
    },
  });

  if (initialData.length === 0) {
    return (
      <div className="background-light900_dark300 border-light_dark flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center p-6">
        <p className="text-dark200_light900 font-medium">No appointments found</p>
      </div>
    );
  }

  return (
    <>
      <div className="background-light900_dark300 border-light_dark overflow-hidden rounded-xl border">
        <Table>
          <TableHeader className="background-light800_dark400">
            <TableRow className="table-border-light_dark border-b hover:bg-transparent">
              <TableHead className="text-dark200_light900 font-medium">Client Info</TableHead>
              <TableHead className="text-dark200_light900 font-medium">Inquiry Subject</TableHead>
              <TableHead className="text-dark200_light900 font-medium">Meeting Schedule</TableHead>
              <TableHead className="text-dark200_light900 w-[160px] font-medium">Status</TableHead>
              <TableHead className="text-dark200_light900 w-[60px] text-center font-medium">Inspect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((row) => {
              const cleanStatus = sanitizeStatus(row.status);
              const statusStyle = STATUS_CONFIG[cleanStatus];
              const fullName = [row.first_name, row.last_name].filter(Boolean).join(" ") || "Not provided";
              const appointmentDateTime = row.appointment_date
                ? `${format(new Date(row.appointment_date), "MMM dd, yyyy")} • ${row.appointment_time ?? "Time not provided"}`
                : "Not provided";

              return (
                <TableRow 
                  key={row.id} 
                  className="table-border-light_dark group cursor-pointer border-b transition-colors hover:bg-slate-100/70 dark:hover:bg-dark-200/70"
                  onClick={() => setSelectedAppointment(row)}
                >
                  <TableCell className="py-4">
                    <div className="text-dark200_light900 font-semibold transition-colors">{fullName}</div>
                    <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{row.email ?? "Not provided"}</div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="text-dark200_light900 max-w-[240px] truncate text-sm font-medium">
                      {row.service_interest ?? "Not specified"}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="background-light800_dark400 rounded px-1.5 py-0.5 text-[10px] capitalize">
                        {row.project_type ?? "Not provided"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="text-dark200_light900 text-xs font-medium">
                      {appointmentDateTime}
                    </div>
                    <div className="mt-0.5 text-[10px] capitalize">Channel: {row.meeting_type ?? "Not provided"}</div>
                  </TableCell>

                  <TableCell className="py-4" onClick={(e) => e.stopPropagation()}>
                    <Select
                      defaultValue={cleanStatus}
                      disabled={pendingRowId === row.id}
                      onValueChange={(val) => updateStatus({ id: row.id, status: val as AppointmentStatus })}
                    >
                      <SelectTrigger className={`h-8 w-full border text-xs font-semibold rounded-lg shadow-sm ${statusStyle.className}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="background-light900_dark300 border-light_dark text-dark200_light900">
                        {appointmentStatusSchema.options.map((option) => (
                          <SelectItem key={option} value={option} className="text-xs focus:bg-slate-100 dark:focus:bg-dark-200 cursor-pointer">
                            {STATUS_CONFIG[option].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="text-center py-4">
                    <button
                      className="border-light_dark background-light800_dark400 text-dark200_light900 rounded-md border p-1.5 transition-all hover:bg-slate-200 dark:hover:bg-dark-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(row);
                      }}
                      aria-label="View appointment details"
                      type="button"
                    >
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