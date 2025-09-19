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
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";
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
            
            <Toaster 
              richColors
              position="top-right"
              toastOptions={{
                className: "dark:bg-gray-800 dark:text-white",
              }}
            />
            
            <AppRouterCacheProvider>
              <MuiStyleRoot>
                <main className="background-light850_dark100 relative flex max-w-full flex-col overflow-clip">
                  <ErrorBoundary
                    fallback={
                      <div className="p-4 text-center">
                        Navigation failed to load
                      </div>
                    }
                  >
                    <Navbar />
                  </ErrorBoundary>
                  <div className="flex">
                    <ErrorBoundary
                      fallback={
                        <div className="w-16 bg-gray-100 dark:bg-gray-800" />
                      }
                    >
                      <LeftSidebar />
                    </ErrorBoundary>
                    <section className="background-lightsection_darksection flex min-h-screen w-full flex-1 flex-col px-2 pb-6 pt-24 max-md:pb-14 sm:px-4 md:px-8 lg:px-12">
                      <div className="max-w-8xl mx-auto h-full w-full">
                        <Suspense fallback={
                          <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customBlue-500"></div>
                          </div>
                        }>
                          <AsyncErrorBoundary>{children}</AsyncErrorBoundary>
                        </Suspense>
                      </div>
                    </section>
                  </div>
                </main>
              </MuiStyleRoot>
            </AppRouterCacheProvider>
          </ThemeProvider>
        </UserProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  );
}
