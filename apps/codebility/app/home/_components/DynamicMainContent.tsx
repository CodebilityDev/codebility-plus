"use client";

import { ReactNode } from "react";
import { useNavStore } from "@/hooks/navigation/use-sidebar";

interface DynamicMainContentProps {
  children: ReactNode;
}

export default function DynamicMainContent({ children }: DynamicMainContentProps) {
  const { isToggleOpen } = useNavStore();

  const marginClass = isToggleOpen ? "lg:ml-64" : "lg:ml-20";

  return (
    <main
      className={`background-lightsection_darksection flex-1 pt-[60px] overflow-y-auto overflow-x-hidden h-full ${marginClass} transition-all duration-300 ease-in-out`}
    >
      {children}
    </main>
  );
}
