import dynamic from "next/dynamic";

import { TimeLog } from "../_types/time-log";

const TimeTrackerTableDesktop = dynamic(
  () => import("./TimeTrackerTableDesktop"),
  { ssr: false },
);
const TimeTrackerTableMobile = dynamic(
  () => import("./TimeTrackerTableMobile"),
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
