import Box from "@/Components/shared/dashboard/Box"
import FE1stRunnerUp from "@/public/assets/svgs/badges/fe-tier-5.svg"
import FE2ndRunnerUp from "@/public/assets/svgs/badges/fe-tier-4.svg"
import FEChampion from "@/public/assets/svgs/badges/fe-tier-champion.svg"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/Components/ui/table"
import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client"

interface TopNotcher {
  id: string;
  first_name: string;
  main_position: string;
  level: number;
}

export default async function WeeklyTop() {
  const supabase = getSupabaseServerComponentClient();
  const { data, error } = await supabase.rpc("get_weekly_top_codevs");  
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
            {
              error ?
                <div>ERROR</div>
                :
                data.map(({ id, first_name, main_position, level }: TopNotcher, index: number) => {
                  const placement = index + 1;

                  const AbbreviationMap = {
                    "Fullstack Developer": "FS",
                    "Front End Developer": "FE",
                    "Back End Developer": "BE",
                    "Mobile Developer": "M",
                    "Admin": "AD",
                  }

                  const role = AbbreviationMap[main_position as keyof typeof AbbreviationMap] || main_position;

                  return <TableRow
                    key={id}
                    className={`grid grid-cols-3 gap-3 md:grid-cols-4 ${
                      placement == 1
                        ? "bg-gradient-to-r from-[#9c813b] to-[#ecc258] text-white"
                        : placement == 2
                        ? "bg-gradient-to-r from-[#464646] to-[#a8a8a8] text-white"
                        : placement == 3 && "bg-gradient-to-r from-[#563c1e] to-[#ba8240] text-white"
                    }`}
                  >
                    <TableCell className="flex justify-center text-center">
                      {" "}
                      {placement == 1 ? (
                        <FEChampion className="h-[1.8rem] w-[1.8rem]" />
                      ) : placement == 2 ? (
                        <FE1stRunnerUp className="h-[1.7rem] w-[1.7rem]" />
                      ) : placement == 3 ? (
                        <FE2ndRunnerUp className="h-[1.7rem] w-[1.7rem]" />
                      ) : (
                        placement
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="capitalize">{first_name}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <p>{role}</p>
                    </TableCell>
                    <TableCell className="hidden text-center md:block">
                      <p>{level}</p>
                    </TableCell>
                  </TableRow>
            })}
          </TableBody>
        </Table>
      </div>
    </Box>
  )
}
