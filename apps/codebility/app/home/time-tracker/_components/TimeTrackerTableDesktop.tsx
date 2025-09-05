import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconEdit } from "@/public/assets/svgs";

import { TimeLog } from "../_types/time-log";
import { convertHoursToHMS } from "../../tasks/_lib/utils";

interface Props {
  timeLog: TimeLog[];
}

export default function TimeTrackerTableDesktop({ timeLog }: Props) {
  return (
    <Table className="background-box text-dark100_light900">
      <TableHeader className="dark:bg-dark-100">
        <TableRow className="grid grid-cols-10 xl:grid-cols-11">
          <TableHead className="col-span-2 p-2 xl:col-span-3">Task</TableHead>
          <TableHead className="p-2 text-center">Points</TableHead>
          <TableHead className="col-span-2 p-2 text-center">
            Rendered Hours
          </TableHead>
          <TableHead className="col-span-2 p-2 text-center">
            Duration Hours
          </TableHead>
          <TableHead className="col-span-2 p-2 text-center">Project</TableHead>
          <TableHead className="p-2 text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeLog.length > 0 ? (
          timeLog.map(
            (
              log,
              index, // reverse log array to start from newest log.
            ) => {
              console.log("log: ", log);
              return (
                <TableRow
                  key={index}
                  className="grid grid-cols-10 xl:grid-cols-11"
                >
                  <TableCell className="col-span-2 flex-wrap xl:col-span-3">
                    {log.task.title}
                  </TableCell>
                  <TableCell className="text-center">{0}</TableCell>
                  <TableCell className="col-span-2 text-center">
                    {convertHoursToHMS(log.worked_hours)}
                  </TableCell>
                  <TableCell className="col-span-2 text-center">
                    {convertHoursToHMS(log.task.duration)}
                  </TableCell>
                  <TableCell className="col-span-2 text-center">
                    {log.task.project.name}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <IconEdit />
                  </TableCell>
                </TableRow>
              );
            },
          )
        ) : (
          <TableRow>
            <TableCell>No data</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
