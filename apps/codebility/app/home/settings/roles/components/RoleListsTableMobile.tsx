import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { positions } from "@/constants";
import { useModal } from "@/hooks/use-modal";
import { IconDelete, IconEdit } from "@/public/assets/svgs";

const RoleListsTableMobile = () => {
  const { onOpen } = useModal();

  return (
    <>
      {positions.map((role, index) => (
        <Table
          key={index}
          className="background-box  text-dark100_light900 my-[10px] flex h-auto flex-col  rounded border border-zinc-200 shadow-sm dark:border-zinc-700 "
        >
          <TableBody className="flex flex-col">
            <TableRow>
              <TableCell> {role}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="flex cursor-pointer flex-row justify-end gap-5">
                <button
                  className=""
                  onClick={() => onOpen("editRoleModal", role)}
                >
                  <IconEdit />
                </button>
                <button
                  className=""
                  onClick={() => onOpen("deleteRoleModal", role)}
                >
                  <IconDelete className="text-blue-100 hover:text-blue-200" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </>
  );
};
export default RoleListsTableMobile;
