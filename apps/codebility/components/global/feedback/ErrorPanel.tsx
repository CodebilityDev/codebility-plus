"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorPanelProps {
  digest?: string;
  retry: () => void;
  fullscreen?: boolean;
}

export default function ErrorPanel({
  digest,
  retry,
  fullscreen = false,
}: ErrorPanelProps) {
  return (
    <section
      role="alert"
      className={
        "flex items-center justify-center bg-[#030303] px-6 py-16 text-[#f4f4f4] " +
        (fullscreen ? "min-h-screen" : "min-h-[60vh]")
      }
    >
      <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#c4b5fd]">
          <AlertTriangle className="h-5 w-5" aria-hidden />
        </span>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a1a1aa]">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#f4f4f4] sm:text-4xl">
          This page could not load
        </h1>
        <p className="mt-4 max-w-[440px] text-sm leading-6 text-[#a1a1aa]">
          The page hit an unexpected error. Try again, or return home if the
          problem continues.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#9747ff] px-5 text-sm font-medium text-white transition-colors hover:bg-[#8b3df0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c084fc]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 px-5 text-sm font-medium text-[#f4f4f4] transition-colors hover:border-white/30 hover:bg-white/5"
          >
            Go to home page
          </Link>
        </div>
        {digest ? (
          <p className="mt-6 font-mono text-[11px] text-[#71717a]">
            Reference: {digest}
          </p>
        ) : null}
      </div>
    </section>
  );
}
