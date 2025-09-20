import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  noPadding?: boolean;
}

export default function PageContainer({ 
  children, 
  className,
  maxWidth = "7xl",
  noPadding = false
}: PageContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    "7xl": "max-w-7xl",
    full: "max-w-full"
  };

  return (
    <div className={cn(
      "min-h-screen bg-white dark:bg-gray-950",
      className
    )}>
      <div className={cn(
        "mx-auto h-full",
        maxWidthClasses[maxWidth],
        !noPadding && "px-2 pt-6 pb-6 sm:px-4 sm:pt-8 sm:pb-8 md:px-8 md:pt-10 md:pb-10 lg:px-12 lg:pt-12 lg:pb-12",
        "max-md:pb-14", // Extra bottom padding for mobile navigation
        className?.includes("flex") && "flex flex-col"
      )}>
        {children}
      </div>
    </div>
  );
}