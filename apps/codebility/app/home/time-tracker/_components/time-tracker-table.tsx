import dynamic from "next/dynamic";
import { Box } from "@/Components/shared/dashboard";
import { Skeleton } from "@/Components/ui/skeleton/skeleton";

import { TimeLog } from "../_types/time-log";

const TimeTrackerTableDesktop = dynamic(
  () => import("./time-tracker-table-desktop"),
  { ssr: false },
);
const TimeTrackerTableMobile = dynamic(
  () => import("./time-tracker-table-mobile"),
  { ssr: false },
);

interface Props {
  timeLog: TimeLog[];
}

export default function TimeTrackerTable({ timeLog }: Props) {
  return (
    <>
      {timeLog ? (
        <div className="hidden md:block">
          <TimeTrackerTableDesktop timeLog={timeLog} />
        </div>
      ) : (
        <Box className="h-70">
          <div className="mx-auto flex flex-col items-center gap-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Box>
      )}
      <div className="block md:hidden">
        <TimeTrackerTableMobile timeLog={timeLog} />
      </div>
    </>
  );
}
