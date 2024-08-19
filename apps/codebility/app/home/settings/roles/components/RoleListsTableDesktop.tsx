import { IconDelete, IconEdit } from "@/public/assets/svgs"
import { Table, TableBody, TableRow, TableCell, TableHeader, TableHead } from "@/Components/ui/table"
import { useModal } from "@/hooks/use-modal"
import { useQuery } from "@tanstack/react-query"
import { getRoles } from "@/app/api/settings"

const RoleListsTableDesktop = () => {
  const { onOpen } = useModal()

  const { data: Roles } = useQuery({
    queryKey: ["Roles"],
    queryFn: async () => {
      return getRoles()
    },
    refetchInterval: 3000,
  })
  return (
    <Table className="background-box text-dark100_light900 h-[240px] w-full  rounded-lg shadow-lg">
      <TableHeader className=" rounded-lg dark:bg-dark-100">
        <TableRow className="flex h-14 w-full  flex-row rounded-lg">
          <TableHead className="flex basis-[80%] items-center ">Name</TableHead>
          <TableHead className="flex basis-[10%] items-center ">Edit</TableHead>
          <TableHead className="flex basis-[10%] items-center ">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="flex w-full flex-col">
        {Roles?.map((role: { id: string; name: string }) => (
          <TableRow
            key={role.id}
            className=" md:text-md flex w-full flex-row items-center  text-sm even:bg-black-300 lg:text-lg"
          >
            <TableCell className="basis-[80%] pl-9  font-medium">{role.name}</TableCell>
            <TableCell className=" basis-[10%]   cursor-pointer items-center justify-center hover:text-black-200">
              <button className="" onClick={() => onOpen("editRoleModal", role.name)}>
                <IconEdit />
              </button>
            </TableCell>
            <TableCell className=" basis-[10%] cursor-pointer items-center justify-center hover:text-black-200">
              <button className="" onClick={() => onOpen("deleteRoleModal", role)}>
                <IconDelete className="text-blue-100 hover:text-blue-200" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
export default RoleListsTableDesktop
