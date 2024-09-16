"use client";

import { permissions_TableRowProps as TableRowProps } from "../_types/permissions";
import { Header } from "./permissions-header";
import { TableRow } from "./permissions-table-row";
import { TableRowMobile } from "./permissions-table-row-mobile";

const PermissionsTable = ({ Roles }: { Roles: TableRowProps[] }) => {
  return (
    <>
      <div className="grid-rows-[repeat12,1fr)] hidden grid-cols-[min-content,repeat(12,1fr)] place-items-stretch gap-x-0 gap-y-0 md:grid">
        <Header />
        {Roles?.map((role: TableRowProps) => (
          <TableRow key={role.id} {...role} />
        ))}
      </div>
      <div className="block md:hidden">
        {Roles?.map((role: TableRowProps) => (
          <TableRowMobile key={role.id} {...role} />
        ))}
      </div>
    </>
  );
};

export default PermissionsTable;
