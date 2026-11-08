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
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-5">
      <div className="grid gap-4 md:grid-cols-2">
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

      <div className="flex flex-col gap-2">
        <span className="text-sm text-white/70">Budget</span>
        <div role="group" aria-label="Budget" className="flex flex-wrap gap-2">
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

      <div className="flex flex-col gap-2">
        <span className="text-sm text-white/70">What do you need?</span>
        <div
          role="group"
          aria-label="What do you need?"
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {needOptions.map((option) => {
            const selected = needs.includes(option);

            return (
              <Chip
                key={option}
                selected={selected}
                onClick={() => toggleNeed(option)}
                className="h-10 w-full justify-start gap-2.5 px-3 text-[13px]"
              >
                {selected ? (
                  <Check aria-hidden className="h-3.5 w-3.5 shrink-0" />
                ) : (
                  <Circle
                    aria-hidden
                    className="h-3.5 w-3.5 shrink-0 text-white/30"
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

      <div className="mt-auto flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-xs leading-[18px] text-white/50">
          <Calendar aria-hidden className="h-4 w-4 shrink-0" />
          Next: choose a time on Calendly
        </p>
        <Button type="submit" className="w-full sm:w-auto">
          Send & book a call
          <Send aria-hidden className="h-4 w-4" />
        </Button>
      </div>

      {submitted ? (
        <p role="status" className="text-sm text-[#4bce97]">
          {"Thanks. We'll reply within one business day."}
        </p>
      ) : null}
    </form>
  );
}
