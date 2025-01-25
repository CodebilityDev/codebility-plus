"use client";

import React from "react";
import { ModalProviderHome } from "@/Components/providers/modal-provider-home";
import ReactQueryProvider from "@/hooks/reactQuery";
import { UserProvider } from "@/store/UserProvider";

import ToastNotification from "./_components/home-toast-notification";
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <UserProvider>
        <ModalProviderHome />
        <ToastNotification />
        <main className="background-light850_dark100 relative">
          <Navbar />
          <div className="flex">
            <LeftSidebar />
            <section className="background-lightsection_darksection flex min-h-screen flex-1 flex-col px-4 pb-6 pt-28 max-md:pb-14 md:px-8 lg:px-12">
              <div className="max-w-8xl mx-auto h-full w-full">{children}</div>
            </section>
          </div>
        </main>
      </UserProvider>
    </ReactQueryProvider>
  );
}
