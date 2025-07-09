
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@codevs/ui/button";
import { CardHeader } from "@codevs/ui/card";
import { Input } from "@codevs/ui/input";
import { Skeleton } from "@codevs/ui/skeleton";
import { Plus, Search, Users } from "lucide-react"

export default function KanbanLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-4 w-24 bg-gray-700" />
          <span className="text-gray-500">{">"}</span>
          <Skeleton className="h-4 w-32 bg-gray-700" />
        </div>

        {/* Title and Actions */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64 bg-gray-700" />

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* User avatars */}
            <div className="flex -space-x-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-10 h-10 rounded-full bg-gray-700 border-2 border-gray-900" />
              ))}
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search" disabled className="pl-10 w-64 bg-gray-800 border-gray-700 text-gray-400" />
            </div>

            {/* Action buttons */}
            <Button disabled className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Add column
            </Button>

            <Button disabled className="bg-purple-600 hover:bg-purple-700">
              <Users className="w-4 h-4 mr-2" />
              Add Members
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Column 1 - Todo */}
        <KanbanColumnSkeleton title="Todo" cardCount={3} />

        {/* Column 2 - In Progress */}
        <KanbanColumnSkeleton title="In Progress" cardCount={2} />

        {/* Column 3 - For Review */}
        <KanbanColumnSkeleton title="For Review" cardCount={2} />

        {/* Column 4 - Done */}
        <KanbanColumnSkeleton title="Done" cardCount={3} />
      </div>
    </div>
  )
}

function KanbanColumnSkeleton({ title, cardCount }: { title: string; cardCount: number }) {
  return (
    <div>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gray-600 rounded" />
          <span className="font-medium text-gray-300">{title}</span>
        </div>
        <Skeleton className="w-6 h-6 bg-gray-700 rounded" />
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {Array.from({ length: cardCount }).map((_, i) => (
          <KanbanCardSkeleton key={i} />
        ))}

        {/* Add card button */}
        <div className="flex items-center gap-2 p-3 text-gray-500 hover:text-gray-300 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add a card</span>
        </div>
      </div>
    </div>
  )
}

function KanbanCardSkeleton() {
  return (
    <Card className="bg-black-200 border-gray-700 border-l-4 border-l-orange-500">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Skeleton className="h-5 w-3/4 bg-gray-700" />
          <Skeleton className="w-8 h-8 rounded-full bg-gray-700" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Role/Developer type */}
          <Skeleton className="h-4 w-32 bg-gray-700" />

          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20 bg-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
