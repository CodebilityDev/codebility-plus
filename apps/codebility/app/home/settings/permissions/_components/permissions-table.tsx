"use client";

import { permissions_TableRowProps as TableRowProps } from "../_types/permissions";
import { TableRowMobile } from "./permissions-table-row-mobile";
// import { Header } from "./permissions-header";
// import { TableRow } from "./permissions-table-row";

const PermissionsTable = ({ Roles }: { Roles: TableRowProps[] }) => {
  return (
    <>
      {/* MAHIRAP GAWING RESPONSIVE */}
      {/* <div className="md:grid grid-rows-[repeat12,1fr)] hidden grid-cols-[min-content,repeat(12,1fr)] place-items-stretch gap-x-0 gap-y-0">
        <Header />
        {Roles?.map((role: TableRowProps) => (
          <TableRow key={role.id} {...role} />
        ))}
      </div> */}
      <div className="block">
        {Roles?.map((role: TableRowProps) => (
          <TableRowMobile key={role.id} {...role} />
        ))}
      </div>
    </>
  );
};

export default PermissionsTable;
