"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/** One collapsible profile-completion row. */
export default function DashboardCompleteProfileTask({
  title,
  description,
  points,
}: {
  title: string;
  description: string;
  points: number | string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-white/20 dark:hover:bg-white/10"
      >
        <div className="flex flex-1 items-center gap-3">
          <div className="h-4 w-4 rounded-full border border-white/30 bg-white/20 transition-all duration-300 dark:border-white/20 dark:bg-white/10" />

          <span className="font-medium text-white dark:text-gray-200">
            {title}
          </span>

          <span className="ml-auto mr-2 inline-flex items-center rounded-full border border-white/30 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm dark:border-white/20 dark:text-gray-300">
            +{points} pts
          </span>
        </div>

        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-white/20 bg-white/5 px-4 pb-4 pt-2 backdrop-blur-sm dark:border-white/10">
          <p className="text-sm text-gray-300 dark:text-gray-400">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
