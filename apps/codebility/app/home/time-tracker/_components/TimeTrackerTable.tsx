
import React, { memo } from "react";
import { TimeLog } from "../_types/time-log";
import TimeTrackerTableDesktop from "./TimeTrackerTableDesktop";
import TimeTrackerTableMobile from "./TimeTrackerTableMobile";

interface Props {
  timeLog: TimeLog[];
}

function TimeTrackerTable({ timeLog }: Props) {
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

export default memo(TimeTrackerTable);
