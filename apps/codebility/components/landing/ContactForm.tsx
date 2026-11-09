"use client";

import { Calendar, Check, Circle, Send } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/global/design-system/Button";
import { Chip } from "@/components/global/design-system/Chip";
import { Textarea } from "@/components/global/design-system/Textarea";
import { TextField } from "@/components/global/design-system/TextField";
import {
  budgetOptions,
  needOptions,
} from "@/constants/landing/landing-content";

export function ContactForm() {
  const [budget, setBudget] = React.useState("$5k - $15k");
  const [needs, setNeeds] = React.useState<string[]>([
    "Web App",
    "AI Development",
  ]);
  const [submitted, setSubmitted] = React.useState(false);

  const toggleNeed = (need: string) => {
    setNeeds((current) =>
      current.includes(need)
        ? current.filter((item) => item !== need)
        : [...current, need],
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");
    const email = data.get("email");

    if (typeof name !== "string" || typeof email !== "string") return;
    if (!name.trim() || !email.trim()) return;

    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-[var(--cb-space-20)]">
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
        <span className="text-sm text-[color:var(--cb-text-secondary)]">Budget</span>
        <div role="group" aria-label="Budget" className="flex flex-wrap gap-[var(--cb-space-8)]">
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
        <span className="text-sm text-[color:var(--cb-text-secondary)]">What do you need?</span>
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
                  <Check aria-hidden className="h-[var(--cb-size-14)] w-[var(--cb-size-14)] shrink-0" />
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
          <Calendar aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)] shrink-0" />
          Next: choose a time on Calendly
        </p>
        <Button type="submit" className="w-full sm:w-auto">
          Send & book a call
          <Send aria-hidden className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" />
        </Button>
      </div>

      {submitted ? (
        <p role="status" className="text-sm text-[color:var(--cb-success)]">
          {"Thanks. We'll reply within one business day."}
        </p>
      ) : null}
    </form>
  );
}
