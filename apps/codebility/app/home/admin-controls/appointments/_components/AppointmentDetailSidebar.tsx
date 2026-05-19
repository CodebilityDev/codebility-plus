"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@codevs/ui/sheet";
import { format } from "date-fns";
import { type AppAppointmentRow } from "../types";
import { Star } from "lucide-react"; // Built-in shared icon packaging primitive

interface AppointmentDetailSidebarProps {
  appointment: AppAppointmentRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDetailSidebar({ appointment, isOpen, onClose }: AppointmentDetailSidebarProps) {
  if (!appointment) return null;

  const fullName = [appointment.first_name, appointment.last_name].filter(Boolean).join(" ") || "Prospect Client";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-neutral-950 border-neutral-800 text-neutral-200 overflow-y-auto sm:max-w-md w-full shadow-2xl">
        <SheetHeader className="border-b border-neutral-800 pb-4">
          <SheetTitle className="text-xl font-bold text-white">{fullName}</SheetTitle>
          <SheetDescription className="text-neutral-400 text-xs mt-0.5">
            Submitted request on {format(new Date(appointment.created_at), "PPP p")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6 text-sm">
          {/* Section 1: Contact Profiling Details */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Contact Profiles</h3>
            <div className="rounded-lg bg-neutral-900/50 border border-neutral-800 p-3 flex flex-col gap-1.5 font-sans">
              <div><span className="text-neutral-500 text-xs">Email:</span> <span className="text-neutral-300 font-medium">{appointment.email || "N/A"}</span></div>
              <div><span className="text-neutral-500 text-xs">Phone:</span> <span className="text-neutral-300 font-medium">{appointment.phone_number || "N/A"}</span></div>
              <div><span className="text-neutral-500 text-xs">Company:</span> <span className="text-neutral-300 font-medium">{appointment.company_name || "N/A"}</span></div>
              <div><span className="text-neutral-500 text-xs">Industry:</span> <span className="text-neutral-300 font-medium">{appointment.industry || "N/A"}</span></div>
            </div>
          </div>

          {/* Section 2: Step 2 Short Survey Metrics Insights */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Survey Metrics (Step 2)</h3>
            <div className="rounded-lg bg-neutral-900/50 border border-neutral-800 p-3 flex flex-col gap-3">
              <div>
                <div className="text-neutral-500 text-xs">Target Scope Interest:</div>
                <div className="text-neutral-200 font-medium mt-0.5">{appointment.services_interested || "Web Development"}</div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs">Current Product Infrastructure Status:</div>
                <div className="text-neutral-200 font-medium mt-0.5">{appointment.website_status || "New project — no existing site"}</div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs">Requested Features / Functionalities:</div>
                <div className="text-neutral-300 text-xs mt-1 bg-neutral-950 p-2 rounded border border-neutral-800 whitespace-pre-wrap">
                  {appointment.required_features || "e-commerce"}
                </div>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-neutral-800/60">
                <div>
                  <div className="text-neutral-500 text-xs">Referral Channel:</div>
                  <div className="text-neutral-300 font-medium text-xs mt-0.5">{appointment.referral_source || "Social media"}</div>
                </div>
                <div className="text-right">
                  <div className="text-neutral-500 text-xs mb-0.5">Interest Rating:</div>
                  <div className="flex gap-0.5 justify-end">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < (appointment.interest_rating || 5) ? "fill-purple-500 text-purple-500" : "text-neutral-700"}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Step 3 Chosen Schedule Specifications */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Meeting Parameters (Step 3)</h3>
            <div className="rounded-lg bg-neutral-900/50 border border-neutral-800 p-3 flex flex-col gap-2 bg-gradient-to-r from-purple-950/10 to-transparent">
              <div>
                <div className="text-neutral-500 text-xs">Chosen Slot Timestamp:</div>
                <div className="text-sm font-semibold text-purple-400 mt-0.5">
                  {appointment.appointment_date 
                    ? format(new Date(appointment.appointment_date), "EEEE, MMMM dd, yyyy 'at' hh:mm a")
                    : "Not finalized by user dropoff"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs">Target Communication Room Environment:</div>
                <div className="text-neutral-200 font-medium text-xs mt-0.5 capitalize">
                  Via {appointment.meeting_type || "Zoom"} Connection Link
                </div>
              </div>
            </div>
          </div>

          {/* Additional Comments Block */}
          {appointment.message && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Additional Comments</h3>
              <p className="text-xs text-neutral-400 italic bg-neutral-900/30 p-2.5 rounded-lg border border-neutral-800/40">
                "{appointment.message}"
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}