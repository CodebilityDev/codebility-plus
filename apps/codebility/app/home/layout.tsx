import { Suspense } from "react";

import AsyncErrorBoundary from "@/components/global/feedback/AsyncErrorBoundary";
import ErrorBoundary from "@/components/global/feedback/ErrorBoundary";
import { ModalProviderHome } from "@/providers/home/ModalProviderHome";
import { PermissionsProvider } from "@/providers/global/PermissionsProvider";
import { ThemeProvider } from "@/providers/global/ThemeProvider";
import { Toaster } from "sonner";

import ToastNotification from "@/components/home/HomeToastNotification";
import ConditionalMainWrapper from "@/components/home/ConditionalMainWrapper";
import DynamicMainContent from "@/components/home/DynamicMainContent";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeSidebar from "@/components/home/HomeSidebar";
import type { HomeLayoutProps } from "@/types/home/home";

export const instant = false;

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <ErrorBoundary>
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
        <div className="background-light850_dark100 flex min-h-screen flex-col overflow-hidden">
          <ErrorBoundary
            fallback={
              <div className="p-4 text-center">
                Navigation failed to load
              </div>
            }
          >
            <Suspense fallback={<div className="h-[60px]" />}>
              <HomeNavbar />
            </Suspense>
          </ErrorBoundary>
          <div className="flex flex-1 overflow-hidden">
            <ErrorBoundary
              fallback={
                <div className="w-16 bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
              }
            >
              <Suspense
                fallback={
                  <div className="w-16 bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
                }
              >
                <HomeSidebar />
              </Suspense>
            </ErrorBoundary>
            <DynamicMainContent>
              <ConditionalMainWrapper>
                <AsyncErrorBoundary>
                  <PermissionsProvider>{children}</PermissionsProvider>
                </AsyncErrorBoundary>
              </ConditionalMainWrapper>
            </DynamicMainContent>
          </div>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
