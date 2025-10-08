"use client";

import { ReactNode } from "react";
import { useNavStore } from "@/hooks/use-sidebar";

interface DynamicMainContentProps {
  children: ReactNode;
}

export default function DynamicMainContent({ children }: DynamicMainContentProps) {
  const { isToggleOpen } = useNavStore();
  
  // Dynamic margin based on sidebar state
  const marginClass = isToggleOpen ? "ml-64" : "ml-20"; // 16rem = ml-64, 5rem = ml-20
  
  return (
    <main 
      className={`background-lightsection_darksection flex-1 pt-[60px] overflow-y-auto overflow-x-hidden min-h-screen ${marginClass} transition-all duration-300 ease-in-out`}
    >
      {children}
    </main>
  );
}