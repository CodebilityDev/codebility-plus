"use client";

import { Calendar, Check, Circle, Send } from "lucide-react";
import * as React from "react";

import { createStrategyCall } from "@/actions/landing/strategy-call";
import { Button } from "@/components/global/design-system/Button";
import { Chip } from "@/components/global/design-system/Chip";
import { Textarea } from "@/components/global/design-system/Textarea";
import { TextField } from "@/components/global/design-system/TextField";
import { useStrategyCall } from "@/components/landing/StrategyCallProvider";
import {
  budgetOptions,
  needOptions,
} from "@/constants/landing/landing-content";
import { formatStrategyCallDate } from "@/utils/landing/strategy-call";

interface BookingConfirmation {
  date: string;
  time: string;
  email: string;
  meetingLink: string | null;
}

export function ContactForm() {
  const {
    selectedDate,
    selectedTime,
    loading: availabilityLoading,
    error: availabilityError,
  } = useStrategyCall();
  const [budget, setBudget] = React.useState("$5k - $15k");
  const [needs, setNeeds] = React.useState<string[]>([
    "Web App",
    "AI Development",
  ]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [confirmation, setConfirmation] =
    React.useState<BookingConfirmation | null>(null);

  const toggleNeed = (need: string) => {
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");
    const details = data.get("details");

    if (typeof name !== "string" || typeof email !== "string") return;
    if (!name.trim() || !email.trim()) {
      setError("Enter your name and work email.");
      return;
    }

    if (!selectedDate || !selectedTime || availabilityError) {
      setError("Pick an available date and time in the strategy call card.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const result = await createStrategyCall({
        name: name.trim(),
        email: email.trim(),
        budget,
        needs,
        details: typeof details === "string" ? details : "",
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
      });

      if ("error" in result && result.error) {
        throw new Error(result.error);
      }

      setConfirmation({
        date: selectedDate,
        time: selectedTime,
        email: email.trim(),
        meetingLink: result.meetingLink ?? null,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to book the call. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const buttonDisabled =
    submitting ||
    availabilityLoading ||
    Boolean(availabilityError) ||
    !selectedDate ||
    !selectedTime ||
    Boolean(confirmation);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-[var(--cb-space-20)]"
    >
      <div className="grid gap-[var(--cb-space-16)] md:grid-cols-2">
        <TextField
          name="name"
          label="Full name"
          placeholder="Juan Dela Cruz"
          autoComplete="name"
          required
        />
        <TextField
          name="email"
          type="email"
          label="Work email"
          placeholder="you@company.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-[var(--cb-space-8)]">
        <span className="text-sm text-[color:var(--cb-text-secondary)]">
          Budget
        </span>
        <div
          role="group"
          aria-label="Budget"
          className="flex flex-wrap gap-[var(--cb-space-8)]"
        >
          {budgetOptions.map((option) => (
            <Chip
              key={option}
              selected={budget === option}
              onClick={() => setBudget(option)}
            >
              {option}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[var(--cb-space-8)]">
        <span className="text-sm text-[color:var(--cb-text-secondary)]">
          What do you need?
        </span>
        <div
          role="group"
          aria-label="What do you need?"
          className="grid grid-cols-1 gap-[var(--cb-space-8)] sm:grid-cols-2 lg:grid-cols-3"
        >
          {needOptions.map((option) => {
            const selected = needs.includes(option);

            return (
              <Chip
                key={option}
                selected={selected}
                onClick={() => toggleNeed(option)}
                className="h-[var(--cb-size-40)] w-full justify-start gap-2.5 px-[var(--cb-space-12)] text-[13px]"
              >
                {selected ? (
                  <Check
                    aria-hidden
                    className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0"
                  />
                ) : (
                  <Circle
                    aria-hidden
                    className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0 text-[color:color-mix(in_srgb,var(--cb-white)_30%,transparent)]"
                  />
                )}
                {option}
              </Chip>
            );
          })}
        </div>
      </div>

      <Textarea
        name="details"
        label="Project details"
        placeholder="A few lines about your goals and timeline..."
      />

      <div className="mt-auto flex flex-col gap-[var(--cb-space-12)] pt-[var(--cb-space-4)] sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-[var(--cb-space-8)] text-xs leading-[18px] text-[color:var(--cb-text-muted)]">
          <Calendar
            aria-hidden
            className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0"
          />
          {selectedDate && selectedTime
            ? formatStrategyCallDate(selectedDate) +
              " at " +
              selectedTime +
              " PHT"
            : availabilityLoading
              ? "Checking availability..."
              : availabilityError
                ? availabilityError
                : "Pick a time in the strategy call card."}
        </p>
        <Button
          type="submit"
          disabled={buttonDisabled}
          className="w-full sm:w-auto"
        >
          {submitting ? "Booking..." : "Send & book a call"}
          <Send
            aria-hidden
            className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
          />
        </Button>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      {confirmation ? (
        <div
          role="status"
          className="rounded-[var(--cb-radius-12)] border border-[color:var(--cb-border)] bg-[color:var(--cb-panel)] p-[var(--cb-space-16)] text-sm text-[color:var(--cb-text-secondary)]"
        >
          <p className="font-medium text-[color:var(--cb-text)]">
            You are booked for{" "}
            {formatStrategyCallDate(confirmation.date)} at {confirmation.time}{" "}
            PHT.
          </p>
          <p className="mt-1">
            A calendar invitation has been sent to {confirmation.email}.
          </p>
          {confirmation.meetingLink ? (
            <a
              href={confirmation.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-medium text-[color:var(--cb-primary)] underline-offset-4 hover:underline"
            >
              Join Google Meet
            </a>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
