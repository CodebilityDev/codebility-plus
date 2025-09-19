import React, { Suspense } from "react";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ModalProviderHome } from "@/components/providers/modal-provider-home";
import { ThemeProvider } from "@/context/ThemeProvider";
import ReactQueryProvider from "@/hooks/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Toaster } from "sonner";

import ToastNotification from "./_components/HomeToastNotification";
import LeftSidebarServer from "./_components/LeftSidebarServer";
import Navbar from "./_components/Navbar";
import { NavigationOptimizer } from "./_components/NavigationOptimizer";
import PageTransitionWrapper from "./_components/PageTransitionWrapper";
import { PageTransitionSettings } from "./_components/PageTransitionSettings";
import { MuiStyleRoot } from "./(dashboard)/_components/DashboardRoadmapStyleRoot";

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
                <div className="background-light850_dark100 flex min-h-screen flex-col">
                  <ErrorBoundary
                    fallback={
                      <div className="p-4 text-center">
                        Navigation failed to load
                      </div>
                    }
                  >
                    <Navbar />
                  </ErrorBoundary>
                  <div className="flex flex-1">
                    <ErrorBoundary
                      fallback={
                        <div className="w-16 bg-gray-100 dark:bg-gray-800" />
                      }
                    >
                      <LeftSidebarServer />
                    </ErrorBoundary>
                    <main className="background-lightsection_darksection flex-1 pt-[60px]">
                      <div className="mx-auto h-full max-w-8xl">
                        <PageTransitionWrapper>
                          <Suspense fallback={
                            <div className="flex h-64 items-center justify-center">
                              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-customBlue-500"></div>
                            </div>
                          }>
                            <AsyncErrorBoundary>{children}</AsyncErrorBoundary>
                          </Suspense>
                        </PageTransitionWrapper>
                      </div>
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
