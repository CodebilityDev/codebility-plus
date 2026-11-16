"use client";

import type { ReactNode } from "react";
import { Component, useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/codebility-dev/30min";

function CalendlyFallback({ loading = false }: { loading?: boolean }) {
  return (
    <div className="calendly-inline-widget">
      <div
        role="status"
        aria-live="polite"
        className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-6 text-center"
      >
        {loading ? (
          <Loader2
            aria-hidden="true"
            className="h-6 w-6 animate-spin text-white/70"
          />
        ) : null}
        <p className="text-sm text-white/80">
          {loading
            ? "Loading the booking calendar..."
            : "The booking calendar could not load."}
        </p>
      </div>
    </div>
  );
}

class CalendlyErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const InlineWidget = dynamic(
  () => import("react-calendly").then((module) => module.InlineWidget),
  {
    ssr: false,
    loading: () => <CalendlyFallback loading />,
  },
);

export default function BookACallCalendlyWidgetContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || inView) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;

      setInView(true);
      observer.disconnect();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView || failed) return;

    const timeout = window.setTimeout(() => {
      if (!containerRef.current?.querySelector("iframe")) setFailed(true);
    }, 10000);

    return () => window.clearTimeout(timeout);
  }, [failed, inView]);

  return (
    <div
      ref={containerRef}
      className="calendly-widget-container w-full justify-center"
    >
      {inView && !failed ? (
        <CalendlyErrorBoundary fallback={<CalendlyFallback />}>
          <InlineWidget url={CALENDLY_URL} />
        </CalendlyErrorBoundary>
      ) : (
        <CalendlyFallback loading={!failed} />
      )}
      <a
        href={CALENDLY_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-3 block text-center text-sm font-medium text-white underline underline-offset-4 hover:text-white/80"
      >
        Open the booking page
      </a>
    </div>
  );
}
