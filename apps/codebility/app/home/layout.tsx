import React, { Suspense } from "react";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ModalProviderHome } from "@/components/providers/modal-provider-home";
import { ThemeProvider } from "@/context/ThemeProvider";
import ReactQueryProvider from "@/hooks/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Toaster } from "@codevs/ui/sonner/toast";


import ToastNotification from "./_components/HomeToastNotification";
import LeftSidebarServer from "./_components/LeftSidebarServer";
import Navbar from "./_components/Navbar";
import { NavigationOptimizer } from "./_components/NavigationOptimizer";
import PageTransitionWrapper from "./_components/PageTransitionWrapper";
import { PageTransitionSettings } from "./_components/PageTransitionSettings";
import { MuiStyleRoot } from "./(dashboard)/_components/DashboardRoadmapStyleRoot";
import ConditionalMainWrapper from "./_components/ConditionalMainWrapper";

// Force dynamic rendering for layout due to server-side Supabase usage
export const dynamic = "force-dynamic";

// Optimize provider structure - move heavy providers to client
export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <UserProvider>
          <ThemeProvider>
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
            <AppRouterCacheProvider>
              <MuiStyleRoot>
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
                    <main className="background-lightsection_darksection flex-1 pt-[60px] overflow-y-auto overflow-x-hidden min-h-screen ml-20 lg:ml-20">
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
                    </main>
                  </div>
                </div>
              </MuiStyleRoot>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </UserProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
}
