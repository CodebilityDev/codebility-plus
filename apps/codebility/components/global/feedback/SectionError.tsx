"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface SectionErrorProps {
  title?: string;
  description?: string;
}

export default function SectionError({
  title = "This section could not load",
  description = "The rest of the page is still available. Try loading this section again.",
}: SectionErrorProps) {
  const router = useRouter();

  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-3 rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)] p-[var(--cb-space-24)]"
    >
      <span className="flex h-[var(--cb-size-32)] w-[var(--cb-size-32)] items-center justify-center rounded-[var(--cb-radius-8)] border border-[color:var(--cb-border)] bg-[color:var(--cb-glass)] text-[color:var(--cb-p300)]">
        <AlertTriangle className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]" aria-hidden />
      </span>
      <p className="text-base font-semibold leading-5 text-[color:var(--cb-text)]">
        {title}
      </p>
      <p className="text-[13px] leading-5 text-[color:var(--cb-text-muted)]">
        {description}
      </p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="inline-flex h-[var(--cb-size-36)] items-center gap-[var(--cb-space-8)] rounded-[var(--cb-radius-full)] border border-[color:var(--cb-border)] px-[var(--cb-space-16)] text-sm font-medium text-[color:var(--cb-text)] transition-colors hover:border-[color:color-mix(in_srgb,var(--cb-primary)_40%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)]"
      >
        <RefreshCw className="h-[var(--cb-size-14)] w-[var(--cb-size-14)]" aria-hidden />
        Try again
      </button>
    </div>
  );
}
