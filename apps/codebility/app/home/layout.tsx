import { Suspense } from "react";
import AsyncErrorBoundary from "@/components/global/feedback/AsyncErrorBoundary";
import ErrorBoundary from "@/components/global/feedback/ErrorBoundary";
import { ModalProviderHome } from "@/providers/home/ModalProviderHome";
import { ThemeProvider } from "@/providers/global/ThemeProvider";
import ReactQueryProvider from "@/providers/global/ReactQueryProvider";
import { UserProvider } from "@/providers/home/UserProvider";
import { getCurrentCodev } from "@/lib/home/current-codev";
import { Toaster } from "sonner";

import ToastNotification from "@/components/home/HomeToastNotification";
import LeftSidebarServer from "@/components/home/LeftSidebarServer";
import Navbar from "@/components/home/Navbar";
import PageTransitionWrapper from "@/components/home/PageTransitionWrapper";
import { PageTransitionSettings } from "@/components/home/PageTransitionSettings";
import ConditionalMainWrapper from "@/components/home/ConditionalMainWrapper";
import DynamicMainContent from "@/components/home/DynamicMainContent";
import type { HomeLayoutProps } from "@/types/home/home";

export default async function HomeLayout({
  children,
}: HomeLayoutProps) {
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