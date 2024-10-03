import React, { useState } from "react";
import Image from "next/image";
import { Codev } from "@/types/home/codev";
import { twMerge } from "tailwind-merge";

import { InHouseSort } from "../_types/in-house";

interface Props {
  onSort: InHouseSort;
}

const TableHeader = ({ onSort }: Props) => {
  return (
    <thead className="background-lightbox_darkbox border-top text-xl">
      <tr className="table-border-light_dark border-b-[1px] text-left">
        <TableHeaderCell
          title="First Name"
          type="first_name"
          onSort={onSort}
          className=""
        />
        <TableHeaderCell
          title="Last Name"
          type="last_name"
          onSort={onSort}
          className="table-border-light_dark border-r-[1px]"
        />
        <TableHeaderCell
          title="Status"
          type="internal_status"
          onSort={onSort}
        />
        <TableHeaderCell
          title="Type"
          type="type"
          onSort={onSort}
        />
        <TableHeaderCell
          title="Position"
          type="main_position"
          onSort={onSort}
        />
        <TableHeaderCell title="Project" type="projects" onSort={onSort} />
        <TableHeaderCell title="NDA" type="nda_status" onSort={onSort} />
        <th className="p-4 text-xl font-light">Actions</th>
      </tr>
    </thead>
  );
};

type TableHeaderCellProps = {
  title:
    | "First Name"
    | "Last Name"
    | "Status"
    | "Type"
    | "Position"
    | "Project"
    | "NDA"
    | "Actions";
  type: keyof Codev;
  className?: string;
  onSort: InHouseSort;
};

const TableHeaderCell = ({
  title,
  type,
  className,
  onSort,
}: TableHeaderCellProps) => {
  const [sortDirection, setSortDirection] = useState<"up" | "down">("up");

  const handleSortButton = (type: keyof Codev) => {
    onSort(type, sortDirection);
    const newSortDirection = sortDirection === "up" ? "down" : "up";
    setSortDirection(newSortDirection);
  };

  return (
    <th className={twMerge("p-4 text-xl font-light", className)}>
      <span className="mr-2">{title}</span>
      <button onClick={() => handleSortButton(type)} className="">
        {sortDirection === "up" ? (
          <Image
            src={
              "https://codebility-cdn.pages.dev/assets/svgs/icon-triangle.svg"
            }
            alt="Triangle Icon"
            width={0}
            height={0}
            style={{ width: ".75rem", height: "auto" }}
          />
        ) : (
          <Image
            src={
              "https://codebility-cdn.pages.dev/assets/svgs/icon-triangle.svg"
            }
            alt="Triangle Icon"
            width={0}
            height={0}
            style={{ width: ".75rem", height: "auto" }}
            className="rotate-180"
          />
        )}
      </button>
    </th>
  );
};

export default TableHeader;
