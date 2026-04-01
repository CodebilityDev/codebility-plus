"use client";

import { Skeleton } from "@codevs/ui/skeleton";
import { cn } from "@/lib/utils";

const MemberPillSkeleton = ({ size = "md" }: { size?: "md" | "lg" }) => {
  const isLg = size === "lg";
  return (
    <div className={cn(
      "flex items-center gap-4 sm:gap-5 rounded-2xl border-2 border-gray-100 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/40 shadow-sm p-3 sm:p-4 pr-4 sm:pr-8 w-full backdrop-blur-sm animate-pulse",
      isLg ? "max-w-[340px]" : "max-w-[320px] sm:max-w-none sm:min-w-[300px]"
    )}>
      <Skeleton className={cn("rounded-xl flex-shrink-0 bg-gray-200 dark:bg-gray-800", isLg ? "h-14 w-14 sm:h-16 sm:w-16" : "h-10 w-10 sm:h-12 sm:w-12")} />
      <div className="flex flex-col gap-2.5 w-full">
        <Skeleton className={cn("bg-gray-200 dark:bg-gray-800", isLg ? "h-4 w-32" : "h-3 w-28")} />
        <Skeleton className={cn("bg-gray-200 dark:bg-gray-800", isLg ? "h-3 w-24" : "h-2 w-20")} />
      </div>
    </div>
  );
};

const RolePillSkeleton = () => (
  <div className="animate-pulse h-14 sm:h-16 w-full max-w-[320px] sm:min-w-[300px] flex items-center justify-between gap-4 sm:gap-6 rounded-2xl border-2 border-gray-100 dark:border-gray-800/60 bg-white/50 dark:bg-gray-900/40 px-4 sm:px-8 shadow-sm backdrop-blur-sm">
    <div className="flex items-center gap-3 sm:gap-4 truncate mr-2 w-full">
      <Skeleton className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
      <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
    </div>
    <Skeleton className="h-7 w-7 rounded-lg bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
  </div>
);

const VerticalConnectorSkeleton = () => (
  <div className="flex lg:hidden h-10 w-[2px] bg-gray-200 dark:bg-gray-800 relative my-2 z-0 animate-pulse">
    <div className="absolute top-0 -left-[5px] h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700" />
    <div className="absolute bottom-0 -left-[5px] h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-700" />
  </div>
);

const HorizontalConnectorSkeleton = ({ crossbar, flexGrow, count, coreCount }: any) => (
  <div className={cn("hidden lg:flex relative h-full items-center justify-center pointer-events-none z-0 animate-pulse", flexGrow ? "flex-grow min-w-[30px] xl:min-w-[60px]" : "w-16 xl:w-24")}>
    <Skeleton className="w-full h-[2px] bg-gray-200 dark:bg-gray-800" />
    
    <div className="absolute left-0 h-3 w-3 -ml-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />

    {crossbar && count && count > 1 && (
      <>
        {coreCount && coreCount > 1 && (
           <Skeleton
             className="absolute left-0 w-[2px] bg-gray-200 dark:bg-gray-800" 
             style={{ height: `${(coreCount - 1) * 112}px` }} 
           />
        )}
        <Skeleton
          className="absolute right-0 w-[2px] bg-gray-200 dark:bg-gray-800" 
          style={{ height: `${(count - 1) * 96}px` }} 
        />
        <div className="absolute right-0 h-3 w-3 -mr-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
      </>
    )}
    
    {!crossbar && (
       <>
         <Skeleton
           className="absolute right-0 w-[2px] bg-gray-200 dark:bg-gray-800" 
           style={{ height: `${2 * 112}px` }} 
         />
         <div className="absolute right-0 h-3 w-3 -mr-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
       </>
    )}
  </div>
);

export default function OrgChartSkeleton() {
  return (
    <div className="relative w-full pt-8 pb-32 flex flex-col items-center min-h-[calc(100vh-80px)] overflow-x-hidden">
      <div className="w-full max-w-[1600px] px-8 2xl:px-12 mb-16">
        <div className="flex flex-col gap-4 animate-pulse">
          <Skeleton className="h-12 w-[220px] bg-gray-200 dark:bg-gray-800 rounded-lg self-start" />
          <div className="flex flex-col gap-2 mt-2">
            <Skeleton className="h-4 w-full max-w-2xl bg-gray-200 dark:bg-gray-800" />
            <Skeleton className="h-4 w-3/4 max-w-xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>

      <div className="relative w-full grid [grid-template-areas:'stack'] place-items-center items-start overflow-hidden">
        <div className="[grid-area:stack] flex items-center justify-center w-full max-w-[1600px] px-4 sm:px-8 2xl:px-12 pb-20 z-10 transition-all pointer-events-none">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 w-full max-w-6xl mx-auto justify-center lg:justify-between">
            
            <div className="flex-shrink-0 flex flex-col items-center z-10 relative w-full lg:w-auto px-2 sm:px-4">
              <MemberPillSkeleton size="lg" />
            </div>

            <VerticalConnectorSkeleton />
            <HorizontalConnectorSkeleton flexGrow />

            <div className="flex flex-col gap-4 lg:gap-12 w-full lg:w-auto items-center z-10 relative px-2 sm:px-4">
              <RolePillSkeleton />
              <RolePillSkeleton />
              <RolePillSkeleton />
            </div>

            <VerticalConnectorSkeleton />
            <HorizontalConnectorSkeleton crossbar flexGrow count={5} coreCount={3} />

            <div className="flex flex-col gap-4 lg:gap-8 w-full lg:w-auto items-center z-10 relative px-2 sm:px-4">
              <RolePillSkeleton />
              <RolePillSkeleton />
              <RolePillSkeleton />
              <RolePillSkeleton />
              <RolePillSkeleton />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
