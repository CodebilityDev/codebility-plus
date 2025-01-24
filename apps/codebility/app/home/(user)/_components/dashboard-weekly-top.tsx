// components/WeeklyTop.tsx
"use client";

import { useEffect, useState } from "react";
import Box from "@/Components/shared/dashboard/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function WeeklyTop() {
  const [topCodevs, setTopCodevs] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTopCodevs = async () => {
      const { data, error } = await supabase
        .from("codev_points")
        .select(
          `
          points,
          codev:codev_id(first_name),
          skill_category:skill_category_id(name)
        `,
        )
        .order("points", { ascending: false })
        .limit(10);

      if (!error && data) setTopCodevs(data);
    };

    fetchTopCodevs();
  }, [supabase]);

  return (
    <Box>
      <div className="flex flex-col gap-6">
        <p className="text-2xl">Weekly Top 10</p>
        <Table>
          <TableHeader className="bg-[#1e1f26]">
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCodevs.map((top, index) => (
              <TableRow key={index} className={getRowStyle(index + 1)}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{top.codev.first_name}</TableCell>
                <TableCell>{top.skill_category.name}</TableCell>
                <TableCell>{top.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Box>
  );
}

const getRowStyle = (rank: number) => {
  const styles = {
    1: "bg-gradient-to-r from-[#9c813b] to-[#ecc258] text-white",
    2: "bg-gradient-to-r from-[#464646] to-[#a8a8a8] text-white",
    3: "bg-gradient-to-r from-[#563c1e] to-[#ba8240] text-white",
  };
  return styles[rank as keyof typeof styles] || "";
};
