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

interface TopCodev {
  points: number;
  codev: {
    first_name: string;
  } | null;
  skill_category: {
    name: string;
  } | null;
}

export default function WeeklyTop() {
  const [topCodevs, setTopCodevs] = useState<TopCodev[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchTopCodevs = async () => {
      try {
        const { data, error } = await supabase
          .from("codev_points")
          .select(
            `
            points,
            codev:codev_id!inner(first_name),
            skill_category:skill_category_id!inner(name)
          `,
          )
          .order("points", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching top codevs:", error);
          return;
        }

        if (data) {
          // Transform the data to match our interface
          const transformedData: TopCodev[] = data.map((item: any) => ({
            points: item.points,
            codev: item.codev ? { first_name: item.codev.first_name } : null,
            skill_category: item.skill_category
              ? { name: item.skill_category.name }
              : null,
          }));

          // Remove any items with null values
          const validData = transformedData.filter(
            (item) => item.codev && item.skill_category,
          );

          setTopCodevs(validData);
        }
      } catch (error) {
        console.error("Error in fetchTopCodevs:", error);
      }
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
                <TableCell>{top.codev?.first_name || "Unknown"}</TableCell>
                <TableCell>
                  {top.skill_category?.name || "Uncategorized"}
                </TableCell>
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
  } as const;

  return styles[rank as keyof typeof styles] || "";
};
