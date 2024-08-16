"use client"

import { useState } from "react"
import { topNotcher } from "@/types"
import { topnotchers } from "@/app/(protectedroutes)/dashboard/dummy"
import Box from "@/Components/shared/dashboard/Box"
import FE1stRunnerUp from "@/public/assets/svgs/badges/fe-tier-5.svg"
import FE2ndRunnerUp from "@/public/assets/svgs/badges/fe-tier-4.svg"
import FEChampion from "@/public/assets/svgs/badges/fe-tier-champion.svg"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table"

const PAGE_SIZE = 10

const WeeklyTop = () => {
  const [currentPage] = useState<number>(1)
  const paginatedTopnotchers = topnotchers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <Box>
      <div className="flex flex-col gap-6">
        <p className="text-2xl">Weekly Top 10</p>
        <Table className="text-dark100_light900">
          <TableHeader className="bg-[#1e1f26]">
            <TableRow className="grid grid-cols-3 place-items-center gap-3 pt-2 md:grid-cols-4">
                <TableHead>Ranking</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:block">Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topnotchers.length > 0 &&
              paginatedTopnotchers.map(({ id, ranking, name, role, level }: topNotcher) => (
                <TableRow
                  key={id}
                  className={`grid grid-cols-3 gap-3 md:grid-cols-4 ${
                    id == 1
                      ? "bg-gradient-to-r from-[#9c813b] to-[#ecc258] text-white"
                      : id == 2
                      ? "bg-gradient-to-r from-[#464646] to-[#a8a8a8] text-white"
                      : id == 3 && "bg-gradient-to-r from-[#563c1e] to-[#ba8240] text-white"
                  }`}
                >
                  <TableCell className="flex justify-center text-center">
                    {" "}
                    {id == 1 ? (
                      <FEChampion className="h-[1.8rem] w-[1.8rem]" />
                    ) : id == 2 ? (
                      <FE1stRunnerUp className="h-[1.7rem] w-[1.7rem]" />
                    ) : id == 3 ? (
                      <FE2ndRunnerUp className="h-[1.7rem] w-[1.7rem]" />
                    ) : (
                      ranking
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="capitalize">{name}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <p>{role}</p>
                  </TableCell>
                  <TableCell className="hidden text-center md:block">
                    <p>{level}</p>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </Box>
  )
}

export default WeeklyTop
