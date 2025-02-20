"use client";

import { InlineWidget } from "react-calendly";

export default function BookACallCalendlyWidgetContainer() {
  return (
    <div className="calendly-widget-container w-full justify-center">
      <InlineWidget url="https://calendly.com/codebility-dev/30min" />
    </div>
  );
}
