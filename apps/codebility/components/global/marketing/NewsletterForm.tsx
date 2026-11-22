"use client";

import * as React from "react";

import { Button } from "@/components/global/design-system/Button";
import { cn } from "@codevs/ui";

export interface NewsletterFormProps {
  className?: string;
}

export function NewsletterForm({ className }: NewsletterFormProps) {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className={cn("w-full max-w-[480px]", className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!email) return;
          setSubmitted(true);
          setEmail("");
        }}
        className="flex h-[var(--cb-size-48)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] p-[var(--cb-space-6)] pl-[var(--cb-space-16)] focus-within:border-[color:var(--cb-primary)] focus-within:ring-2 focus-within:ring-[color:var(--cb-focus-glow)]"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent text-sm text-[color:var(--cb-text)] outline-none placeholder:text-[color:var(--cb-text-muted)]"
        />
        <Button type="submit" size="sm">
          Subscribe
        </Button>
      </form>
      {submitted ? (
        <p className="mt-[var(--cb-space-8)] text-xs leading-[18px] text-[color:var(--cb-success-text)]">
          Subscribed. Check your inbox.
        </p>
      ) : null}
    </div>
  );
}
