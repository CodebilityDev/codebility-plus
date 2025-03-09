"use client";

import { Table, TableBody, TableCell, TableRow } from "@/Components/ui/table";
import { useModal } from "@/hooks/use-modal";
import { IconDelete, IconEdit } from "@/public/assets/svgs";
import { Roles } from "@/types/home/codev";

export default function RoleListsTableMobile({ roles }: { roles: Roles[] }) {
  const { onOpen } = useModal();

  return (
    <>
      {roles?.map((role, index) => (
        <Table
          key={index}
          className="background-box text-dark100_light900 my-[10px] flex h-auto flex-col rounded border border-zinc-200 shadow-sm dark:border-zinc-700"
        >
          <TableBody className="flex flex-col">
            <TableRow>
              <TableCell>{role.name}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className="flex cursor-pointer flex-row justify-end gap-5">
                <button onClick={() => onOpen("editRoleModal", role)}>
                  <IconEdit />
                </button>
                <button onClick={() => onOpen("deleteRoleModal", role)}>
                  <IconDelete className="text-blue-100 hover:text-blue-200" />
                </button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </>
  );
}
