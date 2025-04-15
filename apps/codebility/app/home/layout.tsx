"use client";

import React, { useEffect } from "react";
import { ModalProviderHome } from "@/Components/providers/modal-provider-home";
import { ThemeProvider } from "@/context/ThemeProvider";
import ReactQueryProvider from "@/hooks/reactQuery";
import { useUserStore } from "@/store/codev-store";
import { UserProvider } from "@/store/UserProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import ToastNotification from "./_components/HomeToastNotification";
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";
import { MuiStyleRoot } from "./(dashboard)/_components/DashboardRoadmapStyleRoot";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hydrate } = useUserStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <ReactQueryProvider>
      <UserProvider>
        <ThemeProvider>
          <ModalProviderHome />
          <ToastNotification />
          <AppRouterCacheProvider>
            <MuiStyleRoot>
              <main className="background-light850_dark100 relative">
                <Navbar />
                <div className="flex">
                  <LeftSidebar />
                  <section className="background-lightsection_darksection flex min-h-screen flex-1 flex-col px-4 pb-6 pt-28 max-md:pb-14 md:px-8 lg:px-12">
                    <div className="max-w-8xl mx-auto h-full w-full">
                      {children}
                    </div>
                  </section>
                </div>
              </main>
            </MuiStyleRoot>
          </AppRouterCacheProvider>
        </ThemeProvider>
      </UserProvider>
    </ReactQueryProvider>
  );
}
