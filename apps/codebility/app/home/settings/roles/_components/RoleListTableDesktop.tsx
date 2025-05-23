"use client";

import React from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { useModal } from "@/hooks/use-modal";
import { IconDelete, IconEditFillNone } from "@/public/assets/svgs";
import { Roles } from "@/types/home/codev";
import { Icon } from "lucide-react";

export default function RoleListsTableDesktop({ roles }: { roles: Roles[] }) {
  const { onOpen } = useModal();

  return (
    <Table className="background-box text-dark100_light900 h-[240px] w-full rounded-lg shadow-lg">
      <TableHeader className="dark:bg-dark-100 rounded-lg">
        <TableRow className="flex h-14 w-full flex-row rounded-lg">
          <TableHead className="flex basis-[80%] items-center">Name</TableHead>
          <TableHead className="flex basis-[10%] items-center">Edit</TableHead>
          <TableHead className="flex basis-[10%] items-center">
            Delete
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="flex w-full flex-col">
        {roles?.map((role) => (
          <TableRow
            key={role.id}
            className="md:text-md flex w-full flex-row items-center text-sm hover:opacity-90 lg:text-lg"
          >
            <TableCell className="basis-[80%] pl-9 font-medium">
              {role.name}
            </TableCell>
            <TableCell className="hover:text-black-200 basis-[10%] cursor-pointer items-center justify-center text-blue-600">
              <button onClick={() => onOpen("editRoleModal", role)}>
                =
                <Image
                  src={IconEditFillNone}
                  alt="Edit"
                  width={16}
                  height={16}
                  className="text-black-400 hover:text-black-500 dark:text-white hover:dark:text-white"
                />
              </button>
            </TableCell>
            <TableCell className="hover:text-black-200 basis-[10%] cursor-pointer items-center justify-center">
              <button onClick={() => onOpen("deleteRoleModal", role)}>
                <Image
                  src={IconDelete}
                  alt="Delete"
                  width={16}
                  height={16}
                  className="text-red-600 hover:text-red-500"
                />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
