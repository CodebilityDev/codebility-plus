
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@codevs/ui/button";
import { CardHeader } from "@codevs/ui/card";
import { Input } from "@codevs/ui/input";
import { Skeleton } from "@codevs/ui/skeleton";
import { IconSearch } from "@/public/assets/svgs";
import { Plus, Users } from "lucide-react"

export default function KanbanLoadingSkeleton() {
  return (
    <div className="flex h-full w-full">
      <div className="mx-auto h-full w-[calc(100vw-22rem)] flex-1 flex-col">
        <div className="text-dark100_light900 flex h-full flex-col gap-4 p-6">
          {/* Breadcrumb */}
          <div className="flex flex-row items-center gap-4 text-sm">
            <Skeleton className="h-4 w-24 bg-gray-700 dark:bg-gray-300" />
            <span className="text-gray-500">{">"}</span>
            <Skeleton className="h-4 w-32 bg-gray-700 dark:bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex flex-col gap-4 md:justify-between lg:flex-row">
            {/* Board Title */}
            <Skeleton className="text-md h-8 w-64 bg-gray-700 dark:bg-gray-300 md:text-2xl" />

            {/* Right side controls */}
            <div className="flex flex-col gap-4 xl:flex-row">
              <div className="flex flex-col items-center gap-6">
                {/* User avatars filter */}
                <div className="h-10 overflow-visible">
                  <div className="flex items-center">
                    <div className="flex space-x-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton 
                          key={i} 
                          className="h-8 w-8 rounded-full bg-gray-700 dark:bg-gray-300" 
                          style={{ zIndex: 6 - i }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search bar */}
                <div className="bg-light-900 flex w-[280px] items-center gap-3 rounded-md border border-zinc-300 p-2 dark:border-zinc-500 dark:bg-[#2C303A]">
                  <IconSearch />
                  <Skeleton className="h-4 w-full bg-gray-700 dark:bg-gray-300" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <Button disabled className="flex w-max items-center gap-2 text-sm md:text-base">
                  <Plus className="w-4 h-4" />
                  Add column
                </Button>

                <Button disabled className="flex w-max items-center gap-2 text-sm md:text-base">
                  <Plus className="w-4 h-4" />
                  Add Members
                </Button>
              </div>
            </div>
          </div>

          {/* Kanban Columns */}
          <div className="text-dark100_light900 flex h-full">
            <div className="overflow-x-auto overflow-y-hidden">
              <div className="flex flex-wrap min-h-[calc(100vh-12rem)] w-full gap-4 p-2 md:p-4">
                {/* Column 1 */}
                <KanbanColumnSkeleton title="Todo" cardCount={3} />

                {/* Column 2 */}
                <KanbanColumnSkeleton title="In Progress" cardCount={2} />

                {/* Column 3 */}
                <KanbanColumnSkeleton title="For Review" cardCount={2} />

                {/* Column 4 */}
                <KanbanColumnSkeleton title="Done" cardCount={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KanbanColumnSkeleton({ title, cardCount }: { title: string; cardCount: number }) {
  return (
    <div className="
      relative flex h-full 
      w-[calc(100vw-2rem)] min-w-[280px] 
      flex-col overflow-hidden 
      rounded-md border-2 border-zinc-200 
      md:w-[350px] md:min-w-[350px]
      lg:w-[400px] lg:min-w-[400px]
      bg-[#FCFCFC] dark:border-zinc-700 dark:bg-[#2C303A]
    ">
      {/* Column Header */}
      <div className="flex items-center justify-between p-2 font-bold dark:bg-[#1E1F26] md:p-3">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 md:gap-3">
          <Skeleton className="h-4 w-4 bg-gray-400 dark:bg-gray-600" />
          <span className="text-sm md:text-base">{title}</span>
          <div className="flex items-center justify-center rounded-full bg-zinc-300 px-2 py-1 text-xs dark:bg-[#1C1C1C] md:px-3 md:text-sm">
            {cardCount}
          </div>
        </div>
        <Skeleton className="h-6 w-6 bg-gray-600 dark:bg-gray-400" />
      </div>

      {/* Column Body */}
      <div className="flex flex-grow flex-col px-1 pb-2 md:px-2">
        <div className="flex min-h-[100px] flex-col gap-2 rounded-md p-1 md:gap-4 md:p-2">
          {/* Cards */}
          {Array.from({ length: cardCount }).map((_, i) => (
            <KanbanCardSkeleton key={i} />
          ))}

          {/* Add card button skeleton */}
          <div className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-300 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span className="text-sm">Add a card</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function KanbanCardSkeleton() {
  return (
    <div className="
      group relative cursor-pointer overflow-hidden 
      rounded-lg border border-gray-200 bg-white p-3 shadow-sm
      transition-all duration-200 ease-in-out 
      hover:shadow-lg hover:ring-2 hover:ring-customBlue-200 hover:ring-offset-2
      dark:border-gray-700 dark:bg-[#1E1F26]
      md:p-4
    ">
      {/* Priority Indicator Bar */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg bg-orange-500" />

      {/* Task Header */}
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-5 w-3/4 bg-gray-300 dark:bg-gray-600" />
        
        {/* Primary Avatar */}
        <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white shadow-md dark:border-gray-800 md:h-8 md:w-8">
          <Skeleton className="h-full w-full rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>

      <div className="space-y-3">
        {/* Priority and Status */}
        <div className="flex items-center justify-between text-xs md:text-sm">
          <div className="flex items-center gap-1">
            <span className="capitalize text-gray-600 dark:text-gray-400">Medium</span>
            <Skeleton className="h-3 w-3 bg-gray-300 dark:bg-gray-600 md:h-4 md:w-4" />
          </div>
        </div>

        {/* Skill Category Badge */}
        <div>
          <Skeleton className="inline-block h-5 w-20 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        {/* Sidekick avatars */}
        <div className="flex -space-x-1.5 pt-1 md:-space-x-2 md:pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-5 w-5 rounded-full border-2 border-white bg-gray-300 dark:border-gray-800 dark:bg-gray-600 md:h-7 md:w-7" 
            />
          ))}
        </div>
      </div>
    </div>
  )
}
