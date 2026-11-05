"use client";


import { useNavStore } from "@/store/home/sidebar-store";
import type { DynamicMainContentProps } from "@/types/home/home";


export default function DynamicMainContent({ children }: DynamicMainContentProps) {
  const { isToggleOpen } = useNavStore();

  const marginClass = isToggleOpen ? "lg:ml-64" : "lg:ml-20";

  return (
    <main
      className={`background-lightsection_darksection flex-1 pt-[60px] overflow-y-auto overflow-x-hidden ${marginClass} transition-all duration-300 ease-in-out`}
    >
      {children}
    </main>
  );
}
