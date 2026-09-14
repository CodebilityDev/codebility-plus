"use client";

import { Suspense, ReactNode } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ModalProviderHome } from "@/components/providers/modal-provider-home";

import ToastNotification from "./HomeToastNotification";
import Navbar from "./Navbar";
import { NavigationOptimizer } from "./NavigationOptimizer";
import ConditionalMainWrapper from "./ConditionalMainWrapper";
import DynamicMainContent from "./DynamicMainContent";
import SurveyWidget from "./SurveyWidget";

// Never import an async Server Component here: this module is "use client", so
// it throws "<X> is an async Client Component". Render it in layout.tsx instead.
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
      <NavigationOptimizer />

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
            <Suspense fallback={<PageSpinner />}>{children}</Suspense>
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
