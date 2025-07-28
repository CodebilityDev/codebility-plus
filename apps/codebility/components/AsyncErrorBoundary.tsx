"use client";

import React, { ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import ErrorBoundary from "./ErrorBoundary";

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

/**
 * AsyncErrorBoundary specifically designed for handling async operations
 * like React Query errors, API calls, and other async failures.
 */
export default function AsyncErrorBoundary({ 
  children, 
  fallback,
  onError 
}: AsyncErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onError={(error, errorInfo) => {
            console.error("Async Error:", error, errorInfo);
            if (onError) {
              onError(error);
            }
          }}
          fallback={
            fallback || (
              <div className="flex min-h-[200px] flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 text-2xl">⚠️</div>
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Failed to load data
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  We encountered an error while loading the data. Please try again.
                </p>
                <button
                  onClick={reset}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            )
          }
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}