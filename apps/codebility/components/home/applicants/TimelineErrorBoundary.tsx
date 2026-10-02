"use client";

import { Component } from "react";
import { AlertCircle } from "lucide-react";

import type { BoundaryProps, BoundaryState } from "@/types/home/applicants/applicants";

/**
 * Isolates timeline rendering failures so the surrounding modal still renders.
 * Satisfies the requirement that a timeline error never blocks the modal.
 */
export default class TimelineErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // Silent diagnostic log; no Admin-facing warning beyond the fallback below.
    console.error("[ApplicantProcessTimeline] failed to render:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            The application progress timeline is currently unavailable.
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}
