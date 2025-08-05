import React from "react";
import AsyncErrorBoundary from "@/components/AsyncErrorBoundary";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ModalProviderHome } from "@/components/providers/modal-provider-home";
import { ThemeProvider } from "@/context/ThemeProvider";
import ReactQueryProvider from "@/hooks/reactQuery";
import { UserProvider } from "@/store/UserProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import ToastNotification from "./_components/HomeToastNotification";
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";
import { MuiStyleRoot } from "./(dashboard)/_components/DashboardRoadmapStyleRoot";

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
                        <AsyncErrorBoundary>{children}</AsyncErrorBoundary>
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
