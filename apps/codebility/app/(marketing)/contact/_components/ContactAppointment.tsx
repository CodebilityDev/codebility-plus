"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormData } from "../page";

const meetingTypes = [
  { value: "zoom", label: "Zoom", sub: "Via Zoom meeting link" },
  { value: "gmeet", label: "Google Meet", sub: "Via Google Meet link" },
  { value: "teams", label: "Microsoft Teams", sub: "Via Teams link" },
  { value: "other", label: "Other", sub: "Specify your preferred tool" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM",
];

const unavailableSlots: string[] = [];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const PHT_OFFSET = 8 * 60;

const getPHTToday = () => {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const pht = new Date(utcMs + PHT_OFFSET * 60000);
  pht.setHours(0, 0, 0, 0);
  return pht;
};

const toDateString = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

const formatDisplay = (dateStr: string) => {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d).toLocaleDateString("en-PH", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    timeZone: "Asia/Manila",
  });
};

interface AppointmentProps {
  formData: FormData;
  onBack: () => void;
}

export default function Appointment({ formData, onBack }: AppointmentProps) {
  const today = getPHTToday();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [otherTool, setOtherTool] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = selectedDate && selectedSlot && meetingType &&
    (meetingType !== "other" || otherTool.trim());

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d < today || d.getDay() === 0 || d.getDay() === 6;
  };
  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const isSelected = (day: number) =>
    selectedDate === toDateString(viewYear, viewMonth, day);

  const handleSelectDate = (day: number) => {
    if (isDisabled(day)) return;
    setSelectedDate(toDateString(viewYear, viewMonth, day));
    setSelectedSlot("");
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Step 1
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyName: formData.companyName,
          phoneNumber: formData.phoneNumber,
          industry: formData.industry,
          // Step 2
          serviceInterest: formData.serviceInterest,
          projectType: formData.projectType,
          featuresNeeded: formData.featuresNeeded,
          referralSource: formData.referralSource,
          interestLevel: formData.interestLevel,
          otherRequirements: formData.otherRequirements,
          // Step 3
          appointmentDate: selectedDate,
          appointmentTime: selectedSlot,
          meetingType,
          meetingToolOther: meetingType === "other" ? otherTool : null,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const meetingLabel =
    meetingType === "zoom" ? "Zoom" :
    meetingType === "gmeet" ? "Google Meet" :
    meetingType === "teams" ? "Microsoft Teams" :
    otherTool || "Other";

  if (submitted) {
    return (
      <div className="relative flex w-full flex-col items-center gap-6 text-pretty rounded-lg border border-white/5 bg-white/5 px-5 py-16 text-white">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-violet-500 bg-violet-500/10">
          <svg className="h-7 w-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-xl font-semibold">You're all set!</p>
          <p className="max-w-xs text-sm text-white/40">
            We've received your appointment request. Please kindly wait for us to contact you via email at{" "}
            <span className="text-violet-300">{formData.email}</span>.
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-lg border border-white/5 bg-white/5 px-6 py-4 text-center text-sm">
          <p className="text-white/30">Scheduled for</p>
          <p className="font-medium text-violet-300">{formatDisplay(selectedDate)} · {selectedSlot} PHT</p>
          <p className="text-white/30">{meetingLabel} meeting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col gap-8 text-pretty rounded-lg border border-white/5 bg-white/5 px-5 py-10 text-white lg:py-14 xl:px-10">
      <div className="flex flex-col gap-1">
        <p className="text-xl font-semibold">Set an Appointment</p>
        <p className="text-sm text-white/40">Choose a date and time that works for you</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Calendar */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white/60">Preferred date</p>
          <div className="rounded-lg border border-white/5 bg-white/5 p-4">

            {/* Month nav */}
            <div className="mb-4 flex items-center justify-between">
              <button type="button" onClick={prevMonth} disabled={!canGoPrev}
                className={`flex h-7 w-7 items-center justify-center rounded-md border transition-all ${
                  canGoPrev
                    ? "border-white/10 text-white/50 hover:border-white/20 hover:text-white/80"
                    : "cursor-not-allowed border-white/5 text-white/10"
                }`}>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <p className="text-sm font-semibold">{MONTHS[viewMonth]} {viewYear}</p>
              <button type="button" onClick={nextMonth}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-white/50 transition-all hover:border-white/20 hover:text-white/80">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day headers */}
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-white/20">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const disabled = isDisabled(day);
                const selected = isSelected(day);
                const todayCell = isToday(day);
                return (
                  <button key={day} type="button" disabled={disabled} onClick={() => handleSelectDate(day)}
                    className={`relative flex h-8 w-full items-center justify-center rounded-md text-xs font-medium transition-all duration-150 ${
                      selected ? "bg-violet-600 text-white" :
                      disabled ? "cursor-not-allowed text-white/10" :
                      todayCell ? "border border-violet-500/40 text-violet-300 hover:bg-violet-500/10" :
                      "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}>
                    {day}
                    {todayCell && !selected && (
                      <span className="absolute bottom-1 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-violet-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <p className="mt-3 border-t border-white/5 pt-3 text-center text-xs text-violet-300">
                {formatDisplay(selectedDate)}
              </p>
            )}
          </div>
        </div>

        {/* Time slots */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white/60">Available slots</p>
          {!selectedDate ? (
            <p className="text-xs text-white/20">Select a date above to see available times</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => {
                const isUnavailable = unavailableSlots.includes(slot);
                return (
                  <button key={slot} type="button" disabled={isUnavailable}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border py-2 text-xs font-medium transition-all duration-200 ${
                      isUnavailable ? "cursor-not-allowed border-white/5 text-white/15 line-through" :
                      selectedSlot === slot ? "border-violet-500 bg-violet-500/10 text-violet-300" :
                      "border-white/5 text-white/40 hover:border-white/10 hover:text-white/60"
                    }`}>
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Meeting type */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white/60">Meeting type</p>
          <div className="flex flex-col gap-2">
            {meetingTypes.map((type) => (
              <button key={type.value} type="button" onClick={() => setMeetingType(type.value)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                  meetingType === type.value
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-white/5 bg-white/5 hover:border-white/10"
                }`}>
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                  meetingType === type.value ? "border-violet-500 bg-violet-500" : "border-white/20"
                }`}>
                  {meetingType === type.value && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <div>
                  <p className={`text-sm font-medium ${meetingType === type.value ? "text-violet-300" : "text-white/50"}`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-white/20">{type.sub}</p>
                </div>
              </button>
            ))}
          </div>

          {meetingType === "other" && (
            <input type="text" value={otherTool} onChange={(e) => setOtherTool(e.target.value)}
              placeholder="e.g. Whereby, Skype, Discord..."
              className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200" />
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
          {error}
        </p>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" rounded="md" onClick={onBack}
          className="flex-1 border-white/10 text-white/50 hover:border-white/20 hover:text-white/70">
          ← Back
        </Button>
        <Button variant="purple" rounded="md"
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          className="flex-[2]">
          {loading ? "Submitting..." : "Confirm Appointment ✓"}
        </Button>
      </div>
    </div>
  );
}