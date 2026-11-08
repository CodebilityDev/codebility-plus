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
        className="flex h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5 pl-4 focus-within:border-[#9747ff] focus-within:ring-2 focus-within:ring-[#9747ff]/20"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent text-sm text-[#f4f4f4] outline-none placeholder:text-white/50"
        />
        <Button type="submit" size="sm">
          Subscribe
        </Button>
      </form>
      {submitted ? (
        <p className="mt-2 text-xs leading-[18px] text-[#7be0b6]">
          Subscribed. Check your inbox.
        </p>
      ) : null}
    </div>
  );
}
