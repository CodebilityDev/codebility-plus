import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IconEdit } from "@/public/assets/svgs";

import { TimeLog } from "../_types/time-log";
import { convertHoursToHMS } from "../../tasks/_lib/utils";

interface Props {
  timeLog: TimeLog[];
}

const TimeTrackerTableMobile = ({ timeLog }: Props) => {
  return (
    <>
      {timeLog.reverse().map(
        (
          log,
          index, // reverse log array to start from newest log.
        ) => (
          <Table
            key={index}
            className="background-box text-dark100_light900 my-[10px] flex flex-col  rounded border border-zinc-200 shadow-sm dark:border-zinc-700 "
          >
            <TableBody className="flex flex-col">
              <TableRow>
                <TableCell>Task: {log.task.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Points: {0}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Rendered Hours: {convertHoursToHMS(log.worked_hours)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Duration Hours: {convertHoursToHMS(log.task.duration)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Project: {log.task.project.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="flex cursor-pointer justify-end">
                  <IconEdit />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ),
      )}
    </>
  );
};
export default TimeTrackerTableMobile;
