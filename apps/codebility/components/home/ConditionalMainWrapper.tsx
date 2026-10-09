"use client";

import { usePathname } from "next/navigation";

import { useNavStore } from "@/store/home/sidebar-store";
import type { ConditionalMainWrapperProps } from "@/types/home/home";


export default function ConditionalMainWrapper({ children }: ConditionalMainWrapperProps) {
  const pathname = usePathname();
  useNavStore();
  
  // Check if current route is kanban
  const isKanbanRoute = pathname.includes("/kanban");
  
  if (isKanbanRoute) {
    // Full width for kanban pages - use available space without additional constraints
    return (
      <div className="h-full w-full">
        {children}
      </div>
    );
  }
  
  // Default constrained width for other pages
  return (
    <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}