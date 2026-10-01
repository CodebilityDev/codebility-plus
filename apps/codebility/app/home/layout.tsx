import { Suspense, cache } from "react";

import AsyncErrorBoundary from "@/components/global/feedback/AsyncErrorBoundary";
import ErrorBoundary from "@/components/global/feedback/ErrorBoundary";
import { ModalProviderHome } from "@/providers/home/ModalProviderHome";
import { ThemeProvider } from "@/providers/global/ThemeProvider";
import { Toaster } from "sonner";

import ToastNotification from "@/components/home/HomeToastNotification";
import LeftSidebarClient from "@/components/home/LeftSidebarClient";
import Navbar from "@/components/home/Navbar";
import ConditionalMainWrapper from "@/components/home/ConditionalMainWrapper";
import DynamicMainContent from "@/components/home/DynamicMainContent";
import { getSidebarData } from "@/actions/home/sidebar";
import { getCurrentCodev } from "@/lib/global/current-codev";
import { getSidebarRoleId } from "@/utils/home/home";
import type { HomeLayoutProps } from "@/types/home/home";

const getCachedSidebarData = cache(getSidebarData);

export const instant = false;

export default async function HomeLayout({ children }: HomeLayoutProps) {
  const currentUser = await getCurrentCodev();
  const sidebarData = await getCachedSidebarData(
    getSidebarRoleId(currentUser),
  );

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
              <Navbar currentUser={currentUser} sidebarData={sidebarData} />
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
                <LeftSidebarClient sidebarData={sidebarData} />
              </Suspense>
            </ErrorBoundary>
            <DynamicMainContent>
              <ConditionalMainWrapper>
                <AsyncErrorBoundary>{children}</AsyncErrorBoundary>
              </ConditionalMainWrapper>
            </DynamicMainContent>
          </div>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
