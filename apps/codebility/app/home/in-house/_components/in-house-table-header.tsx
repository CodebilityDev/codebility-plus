import React, { useState } from "react"
import { twMerge } from "tailwind-merge"
import { TeamMemberT } from "@/types/index"
import { inhouse_TableHeader, inhouse_TableHeader2 } from "@/types/protectedroutes"
import Image from "next/image"

const TableHeader = ({ onSort }: inhouse_TableHeader) => {
  return (
    <thead className="background-lightbox_darkbox border-top text-xl">
      <tr className="table-border-light_dark border-b-[1px] text-left">
        <TableHeaderCell title="First Name" type="first_name" onSort={onSort} className="" />
        <TableHeaderCell title="Last Name" type="last_name" onSort={onSort} className="table-border-light_dark border-r-[1px]" />
        <TableHeaderCell title="Status" type="status_internal" onSort={onSort} />
        <TableHeaderCell title="Position" type="main_position" onSort={onSort} />
        <TableHeaderCell title="Project" type="projects" onSort={onSort} />
        <TableHeaderCell title="NDA" type="nda_status" onSort={onSort} />
        <th className="p-4 text-xl font-light">Actions</th>
      </tr>
    </thead>
  )
}

const TableHeaderCell = ({ title, type, className, onSort }: inhouse_TableHeader2) => {
  const [sortDirection, setSortDirection] = useState<"up" | "down">("up")

  const handleSortButton = (type: keyof TeamMemberT) => {
    onSort(type, sortDirection)
    const newSortDirection = sortDirection === "up" ? "down" : "up"
    setSortDirection(newSortDirection)
  }

  return (
    <th className={twMerge("p-4 text-xl font-light", className)}>
      <span className="mr-2">{title}</span>
      <button onClick={() => handleSortButton(type)} className="">
        {sortDirection === "up" ?
          (
            <Image
              src={"https://codebility-cdn.pages.dev/assets/svgs/icon-triangle.svg"}
              alt="Triangle Icon"
              width={0}
              height={0}
              style={{ width: '.75rem', height: "auto" }}
            />
          ) :
          (
            <Image
              src={"https://codebility-cdn.pages.dev/assets/svgs/icon-triangle.svg"}
              alt="Triangle Icon"
              width={0}
              height={0}
              style={{ width: '.75rem', height: "auto" }}
              className="rotate-180"
            />
          )}
      </button>
    </th>
  )
}

export default TableHeader
