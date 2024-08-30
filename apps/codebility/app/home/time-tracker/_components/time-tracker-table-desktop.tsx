import { logData } from "@/app/home/time-tracker/_lib/dummy-data"
import { IconEdit } from "@/public/assets/svgs"
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from "@/Components/ui/table"
import { TimeLog } from "../_types/time-log";

interface Props {
  timeLog: TimeLog[];
}

export default function TimeTrackerTableDesktop({ timeLog }: Props) {
  return (
    <Table className="background-box text-dark100_light900 h-[240px] max-w-[1320px]  rounded-lg shadow-lg">
      <TableHeader className="max-w-[1320px] rounded-lg dark:bg-dark-100">
        <TableRow className="flex h-14 w-full max-w-[1320px] flex-row rounded-lg">
          <TableHead className="flex basis-[20%] items-center justify-center">Task</TableHead>
          <TableHead className="flex basis-[30%] items-center justify-center pl-60">Points</TableHead>
          <TableHead className="flex basis-[50%] items-center justify-center">Rendered Hours</TableHead>
          <TableHead className="flex basis-[50%] items-center justify-center">Duration Hours</TableHead>
          <TableHead className="ml-10 flex basis-[90%] items-center">Project</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="flex w-full flex-col">
        {timeLog.map((log, index) => (
          <TableRow key={index} className="md:text-md flex w-full flex-row items-center text-sm lg:text-lg">
            <TableCell className="basis-[24%] pl-9  font-medium">{log.task.title}</TableCell>
            <TableCell className="basis-[8%] text-center">{0}</TableCell>
            <TableCell className="basis-[18%] text-center">{log.worked_hours.toFixed(8)}</TableCell>
            <TableCell className="basis-[15%] text-center">{(log.task.duration || 0).toFixed(2)}</TableCell>
            <TableCell className="basis-[16%] text-center">{log.task.project.name}</TableCell>
            <TableCell className="ml-20 basis-[10%] cursor-pointer text-center hover:text-black-200">
              <IconEdit />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
