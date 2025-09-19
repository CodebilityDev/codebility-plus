"use client";

import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "sonner";
import LeftSidebar from "./LeftSidebar";
import Navbar from "./Navbar";

interface OptimizedLayoutProps {
  children: React.ReactNode;
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message || "An unexpected error occurred"}
        </p>
      </div>
    </div>
  );
}

export default function OptimizedLayout({ children }: OptimizedLayoutProps) {
  return (
    <>
      <Toaster 
        richColors
        position="top-right"
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
        }}
      />
      <main className="background-light850_dark100 relative flex max-w-full flex-col overflow-clip">
        <ErrorBoundary fallback={<ErrorFallback error={new Error("Navigation failed")} />}>
          <Navbar />
        </ErrorBoundary>
        <div className="flex">
          <ErrorBoundary fallback={<div className="w-16 bg-gray-100 dark:bg-gray-800" />}>
            <LeftSidebar />
          </ErrorBoundary>
          <section className="background-lightsection_darksection flex min-h-screen w-full flex-1 flex-col px-2 pb-6 pt-24 max-md:pb-14 sm:px-4 md:px-8 lg:px-12">
            <div className="max-w-8xl mx-auto h-full w-full">
              <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customBlue-500"></div>
                </div>
              }>
                {children}
              </Suspense>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}