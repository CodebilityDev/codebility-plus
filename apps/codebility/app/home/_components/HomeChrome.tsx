"use client";

import { Suspense, ReactNode } from "react";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ModalProviderHome } from "@/components/providers/modal-provider-home";
import { Toaster } from "sonner";

import ToastNotification from "./HomeToastNotification";
import Navbar from "./Navbar";
import { NavigationOptimizer } from "./NavigationOptimizer";
import PageTransitionWrapper from "./PageTransitionWrapper";
import { PageTransitionSettings } from "./PageTransitionSettings";
import ConditionalMainWrapper from "./ConditionalMainWrapper";
import DynamicMainContent from "./DynamicMainContent";
import SurveyWidget from "./SurveyWidget";

/**
 * Client shell for the home routes.
 *
 * `children` and `sidebar` arrive as props from the server layout. React keeps
 * the same element references across renders of this component, so anything
 * that re-renders here (a sidebar toggle, a notification arriving, a toast)
 * updates the chrome while the page and sidebar subtrees pass through
 * untouched.
 *
 * NEVER import an async Server Component into this file. This module is
 * `"use client"`, so an async component here throws at runtime with
 * "<X> is an async Client Component". Render it in `layout.tsx` and pass it
 * down as a prop instead.
 */
export default function HomeChrome({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="background-light850_dark100 flex min-h-screen flex-col overflow-hidden">
      <ModalProviderHome />
      <ToastNotification />
      <PageTransitionSettings />
      <NavigationOptimizer />
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
        }}
      />

      <ErrorBoundary
        fallback={<div className="p-4 text-center">Navigation failed to load</div>}
      >
        <Navbar />
      </ErrorBoundary>

      <div className="flex flex-1 overflow-hidden">
        <ErrorBoundary
          fallback={
            <div className="w-16 flex-shrink-0 bg-gray-100 dark:bg-gray-800" />
          }
        >
          {sidebar}
        </ErrorBoundary>

        <DynamicMainContent>
          <ConditionalMainWrapper>
            <PageTransitionWrapper>
              <Suspense fallback={<PageSpinner />}>
                <AsyncErrorBoundary>{children}</AsyncErrorBoundary>
              </Suspense>
            </PageTransitionWrapper>
          </ConditionalMainWrapper>
        </DynamicMainContent>
      </div>

      <SurveyWidget />
    </div>
  );
}

function PageSpinner() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-64 items-center justify-center">
        <div className="border-customBlue-500 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2" />
      </div>
    </div>
  );
}
