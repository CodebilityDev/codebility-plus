"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useNavStore } from "@/hooks/use-sidebar";

interface DynamicMainContentProps {
  children: ReactNode;
}

export default function DynamicMainContent({ children }: DynamicMainContentProps) {
  const { isToggleOpen } = useNavStore();
  const pathname = usePathname();

  const isOrgChart = pathname === "/home/orgchart";


  const marginClass = isToggleOpen ? "lg:ml-64" : "lg:ml-20";

  return (
    <main
      className={`background-lightsection_darksection flex-1 pt-[60px] ${isOrgChart ? "lg:overflow-hidden lg:h-[calc(100vh)] overflow-y-auto" : "overflow-y-auto"} overflow-x-hidden h-full ${marginClass} transition-all duration-300 ease-in-out`}
    >
      {children}
    </main>
  );
}