import dynamic from "next/dynamic";

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
      <div className="hidden md:block">
        <TimeTrackerTableDesktop timeLog={timeLog} />
      </div>

      <div className="block md:hidden">
        <TimeTrackerTableMobile timeLog={timeLog} />
      </div>
    </>
  );
}
