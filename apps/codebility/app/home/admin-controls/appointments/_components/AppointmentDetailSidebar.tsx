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

  const fullName = [appointment.first_name, appointment.last_name].filter(Boolean).join(" ") || "Not provided";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="background-light900_dark300 border-light_dark text-dark200_light900 w-full overflow-y-auto shadow-2xl sm:max-w-md">
        <SheetHeader className="table-border-light_dark border-b pb-4">
          <SheetTitle className="text-xl font-bold text-dark-200 dark:text-light-900">{fullName}</SheetTitle>
          <SheetDescription className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Submitted request on {format(new Date(appointment.created_at), "PPP p")}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 py-6 text-sm">
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Contact Profile</h3>
            <div className="background-light800_dark400 border-light_dark flex flex-col gap-1.5 rounded-lg border p-3 font-sans">
              <div><span className="text-xs text-slate-500 dark:text-slate-400">Email:</span> <span className="font-medium">{appointment.email ?? "Not provided"}</span></div>
              <div><span className="text-xs text-slate-500 dark:text-slate-400">Phone:</span> <span className="font-medium">{appointment.phone_number ?? "Not provided"}</span></div>
              <div><span className="text-xs text-slate-500 dark:text-slate-400">Company:</span> <span className="font-medium">{appointment.company_name ?? "Not provided"}</span></div>
              <div><span className="text-xs text-slate-500 dark:text-slate-400">Industry:</span> <span className="font-medium">{appointment.industry ?? "Not provided"}</span></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Survey Metrics (Step 2)</h3>
            <div className="background-light800_dark400 border-light_dark flex flex-col gap-3 rounded-lg border p-3">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Inquiry Subject:</div>
                <div className="mt-0.5 font-medium">{appointment.service_interest ?? "Not specified"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Project Type:</div>
                <div className="mt-0.5 font-medium">{appointment.project_type ?? "Not provided"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Requested Features:</div>
                <div className="background-light900_dark300 border-light_dark mt-1 whitespace-pre-wrap rounded border p-2 text-xs">
                  {appointment.features_needed ?? "Not provided"}
                </div>
              </div>
              <div className="table-border-light_dark flex items-center justify-between border-t pt-1">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Referral Channel:</div>
                  <div className="mt-0.5 text-xs font-medium">{appointment.referral_source ?? "Not provided"}</div>
                </div>
                <div className="text-right">
                  <div className="mb-0.5 text-xs text-slate-500 dark:text-slate-400">Interest Rating:</div>
                  {appointment.interest_level != null ? (
                    <div className="flex justify-end gap-0.5">
                      {(() => {
                        const interestLevel = appointment.interest_level;
                        return Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${i < interestLevel ? "fill-purple-500 text-purple-500" : "text-slate-300 dark:text-slate-700"}`}
                          />
                        ));
                      })()}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">No rating</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meeting Parameters (Step 3)</h3>
            <div className="background-light800_dark400 border-light_dark flex flex-col gap-2 rounded-lg border bg-gradient-to-r from-purple-200/20 to-transparent p-3 dark:from-purple-950/10">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Preferred Meeting Date and Time:</div>
                <div className="mt-0.5 text-sm font-semibold text-purple-600 dark:text-purple-400">
                  {appointment.appointment_date 
                    ? `${format(new Date(appointment.appointment_date), "EEEE, MMMM dd, yyyy")} at ${appointment.appointment_time ?? "Time not provided"}`
                    : "Not provided"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Meeting Type:</div>
                <div className="mt-0.5 text-xs font-medium capitalize">
                  {appointment.meeting_type ?? "Not provided"}
                </div>
              </div>
            </div>
          </div>

          {appointment.other_requirements && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Additional Requirements</h3>
              <p className="background-light800_dark400 border-light_dark rounded-lg border p-2.5 text-xs italic text-slate-600 dark:text-slate-300">
                "{appointment.other_requirements}"
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}