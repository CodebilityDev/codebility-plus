"use client";

import React from "react";
import { H1 } from "@/components/shared/dashboard";

// Search is the only filter wired to the server. The richer per-column filters
// that used to live here re-filtered the whole table in the browser, which the
// server-side pagination makes meaningless; they come back as query parameters
// when the applicant query grows a filter surface to match.
export default function ApplicantFilterHeaders({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <H1>Applicants Management</H1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <input
            type="text"
            placeholder="Search applicants..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full max-w-80 rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
          />
        </div>
      </div>
    </div>
  );
}
