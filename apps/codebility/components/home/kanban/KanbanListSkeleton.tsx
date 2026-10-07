import { Skeleton } from "@codevs/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@codevs/ui/table";

const COLUMN_WIDTHS = ["w-40", "w-24", "w-24", "w-32"];

export default function KanbanListSkeleton() {
  return (
    <div
      aria-busy="true"
      className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900"
    >
      <Table>
        <TableCaption className="sr-only">Loading kanban list</TableCaption>
        <TableHeader>
          <TableRow className="border-b-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            {COLUMN_WIDTHS.map((width, index) => (
              <TableHead key={index} scope="col">
                <Skeleton className={`h-4 ${width}`} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }, (_, row) => (
            <TableRow key={row}>
              {COLUMN_WIDTHS.map((width, index) => (
                <TableCell key={index}>
                  <Skeleton className={`h-4 ${width}`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
