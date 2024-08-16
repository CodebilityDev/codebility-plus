import { logData } from "@/app/(protectedroutes)/time-tracker/data"
import { IconEdit } from "@/public/assets/svgs"
import { Table, TableRow, TableCell, TableBody } from "@/Components/ui/table"

const TimeTrackerTableMobile = () => {
  return (
    <>
      {logData.map((value, index) => (
        <Table
          key={index}
          className="background-box text-dark100_light900 my-[10px] flex h-[355px] flex-col  rounded border border-zinc-200 shadow-sm dark:border-zinc-700 "
        >
          <TableBody className="flex flex-col">
            <TableRow>
              <TableCell>Task: {value.task}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Points: {value.points}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Rendered Hours: {value.renderedHours}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Duration Hours: {value.durationHours}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Project: {value.project}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex cursor-pointer justify-end">
                <IconEdit />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </>
  )
}
export default TimeTrackerTableMobile
