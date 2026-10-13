import { Card, CardContent, CardHeader } from "@codevs/ui/card";
import { Skeleton } from "@codevs/ui/skeleton";

const COLUMN_CARDS = [3, 2, 4];

export default function KanbanBoardSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading board"
      className="flex w-full items-start gap-4 overflow-hidden pb-4"
    >
      {COLUMN_CARDS.map((cards, columnIndex) => (
        <Card
          key={columnIndex}
          className="flex w-72 shrink-0 flex-col"
        >
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 p-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-6 rounded-full" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2 p-2">
            {Array.from({ length: cards }, (_, cardIndex) => (
              <Skeleton key={cardIndex} className="h-16 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
