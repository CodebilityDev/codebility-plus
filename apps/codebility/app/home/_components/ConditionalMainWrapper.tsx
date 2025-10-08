"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface ConditionalMainWrapperProps {
  children: ReactNode;
}

export default function ConditionalMainWrapper({ children }: ConditionalMainWrapperProps) {
  const pathname = usePathname();
  
  // Check if current route is kanban
  const isKanbanRoute = pathname.includes("/kanban");
  
  if (isKanbanRoute) {
    // Full width for kanban pages
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