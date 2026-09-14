"use client";

import { useEffect } from "react";

import { Button } from "@codevs/ui/button";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Home route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Something went wrong
      </h2>
      <p className="mb-6 max-w-md text-gray-600 dark:text-gray-400">
        This page failed to load. You can retry without leaving the app.
      </p>

      {process.env.NODE_ENV === "development" && error.message && (
        <pre className="mb-6 max-w-2xl overflow-auto rounded-lg bg-gray-100 p-4 text-left text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {error.message}
        </pre>
      )}

      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
