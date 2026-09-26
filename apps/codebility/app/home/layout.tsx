import React, { Suspense } from "react";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ModalProviderHome } from "@/components/providers/modal-provider-home";
import { ThemeProvider } from "@/store/providers/ThemeProvider";
import ReactQueryProvider from "@/hooks/query/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { getCurrentCodev } from "@/lib/server/current-codev";
import { Toaster } from "sonner";

import ToastNotification from "./_components/HomeToastNotification";
import LeftSidebarServer from "@/components/shared/dashboard/LeftSidebarServer";
import Navbar from "./_components/Navbar";
import PageTransitionWrapper from "./_components/PageTransitionWrapper";
import { PageTransitionSettings } from "./_components/PageTransitionSettings";
import ConditionalMainWrapper from "./_components/ConditionalMainWrapper";
import DynamicMainContent from "./_components/DynamicMainContent";

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read once here so the sidebar and the client store share one query.
  const currentUser = await getCurrentCodev();

  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <UserProvider initialUser={currentUser}>
          <ThemeProvider>
            <ModalProviderHome />
            <ToastNotification />
            <PageTransitionSettings />
            <Toaster
              richColors
              position="top-right"
              toastOptions={{
                className: "dark:bg-gray-800 dark:text-white",
              }}
            />
                <div className="background-light850_dark100 flex min-h-screen flex-col overflow-hidden">
                  <ErrorBoundary
                    fallback={
                      <div className="p-4 text-center">
                        Navigation failed to load
                      </div>
                    }
                  >
                    <Navbar />
                  </ErrorBoundary>
                  <div className="flex flex-1 overflow-hidden">
                    <ErrorBoundary
                      fallback={
                        <div className="w-16 bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                      }
                    >
                      <LeftSidebarServer />
                    </ErrorBoundary>
                    <DynamicMainContent>
                      <ConditionalMainWrapper>
                        <PageTransitionWrapper>
                          <Suspense fallback={
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="flex h-64 items-center justify-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-customBlue-500"></div>
                              </div>
                            </div>
                          }>
                            <AsyncErrorBoundary>{children}</AsyncErrorBoundary>
                          </Suspense>
                        </PageTransitionWrapper>
                      </ConditionalMainWrapper>
                    </DynamicMainContent>
                  </div>
                </div>
          </ThemeProvider>
        </UserProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
}