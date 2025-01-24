"use client";

import React, { useEffect } from "react";
import { ModalProviderHome } from "@/Components/providers/modal-provider-home";
import ReactQueryProvider from "@/hooks/reactQuery";
import { useUserStore } from "@/store/codev-store";
import { fetchUserData } from "@/utils/fetchUser";

import ToastNotification from "./_components/home-toast-notification";
import LeftSidebar from "./_components/LeftSidebar";
import Navbar from "./_components/Navbar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const userData = await fetchUserData();
      if (userData) {
        setUser(userData);
      }
    };

    fetchAndSetUser();
  }, [setUser]);

  return (
    <ReactQueryProvider>
      <ModalProviderHome />
      {user?.application_status === "passed" && <ToastNotification />}
      <main className="background-light850_dark100 relative">
        <Navbar />
        <div className="flex">
          <LeftSidebar />
          <section className="background-lightsection_darksection flex min-h-screen flex-1 flex-col px-4 pb-6 pt-28 max-md:pb-14 md:px-8 lg:px-12">
            <div className="max-w-8xl mx-auto h-full w-full">{children}</div>
          </section>
        </div>
      </main>
    </ReactQueryProvider>
  );
}
