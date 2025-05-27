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
import { createClientClientComponent } from "@/utils/supabase/client";
import { startOfMonth, startOfWeek, subDays } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { Skeleton } from "@codevs/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@codevs/ui/tabs";

type TimePeriod = "all" | "weekly" | "monthly";

interface TopCodev {
  points: number;
  codev: {
    first_name: string;
  } | null;
  skill_category: {
    name: string;
  } | null;
}

interface CategoryData {
  [key: string]: TopCodev[];
}

const LoadingTable = () => {
  return (
    <Table>
      <TableHeader className="bg-[#1e1f26]">
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, index) => (
          <TableRow key={index} className={getRowStyle(index + 1)}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default function WeeklyTop() {
  const [categoryData, setCategoryData] = useState<CategoryData>({});
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase client safely
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("skill_category")
          .select("name")
          .order("name");

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        if (data) {
          const categories = data.map((cat: { name: string }) => cat.name);

          // Reorder categories to put Frontend Developer first
          const reorderedCategories = [...categories];
          const feIndex = reorderedCategories.findIndex(
            (cat) => cat === "Frontend Developer",
          );

          if (feIndex !== -1) {
            const [frontendDev] = reorderedCategories.splice(feIndex, 1);
            reorderedCategories.unshift(frontendDev);
          }

          setAllCategories(reorderedCategories);
          if (!selectedCategory && reorderedCategories.length > 0) {
            setSelectedCategory(reorderedCategories[0]);
          }
        }
      } catch (error) {
        console.error("Error in fetchCategories:", error);
      }
    };

    fetchCategories();
  }, [supabase, selectedCategory]);

  useEffect(() => {
    if (!supabase || allCategories.length === 0) return;

    const fetchTopCodevs = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        let query = supabase
          .from("codev_points")
          .select(
            `
            points,
            codev:codev_id!inner(first_name),
            skill_category:skill_category_id!inner(name),
            created_at
          `,
          )
          .order("points", { ascending: false });

        if (timePeriod === "weekly") {
          const weekStart = startOfWeek(new Date());
          query = query.gte("created_at", weekStart.toISOString());
        } else if (timePeriod === "monthly") {
          const monthStart = startOfMonth(new Date());
          query = query.gte("created_at", monthStart.toISOString());
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching top codevs:", error);
          return;
        }

        if (data) {
          const groupedData: CategoryData = {};

          allCategories.forEach((category) => {
            groupedData[category] = [];
          });

          data.forEach((item: any) => {
            const category = item.skill_category?.name || "Uncategorized";
            if (groupedData[category] && groupedData[category].length < 10) {
              groupedData[category].push({
                points: item.points,
                codev: item.codev,
                skill_category: item.skill_category,
              });
            }
          });

          setCategoryData(groupedData);
        }
      } catch (error) {
        console.error("Error in fetchTopCodevs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopCodevs();
  }, [supabase, timePeriod, allCategories]);

  const generateTableRows = (category: string) => {
    const rows = [];
    for (let i = 0; i < 10; i++) {
      const data = categoryData[category]?.[i];
      rows.push(
        <TableRow key={i} className={getRowStyle(i + 1)}>
          <TableCell>{i + 1}</TableCell>
          <TableCell>
            {data && data.points > 0
              ? data.codev?.first_name || "Unknown"
              : "-"}
          </TableCell>
          <TableCell>{data?.points || 0}</TableCell>
        </TableRow>,
      );
    }
    return rows;
  };

  const getCategoryInitial = (category: string): string => {
    switch (category) {
      case "UI/UX Designer":
        return "UI/UX";
      case "Frontend Developer":
        return "FE";
      case "Backend Developer":
        return "BE";
      case "Mobile Developer":
        return "MD";
      case "QA Engineer":
        return "QA";
      default:
        return category.substring(0, 2);
    }
  };

  return (
    <Box>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-2xl">Leaderboard</p>
        </div>
        <div className="flex gap-4">
          <Select
            value={timePeriod}
            onValueChange={(value: TimePeriod) => setTimePeriod(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="w-fit"
          >
            <TabsList className="grid h-10 grid-cols-5">
              {allCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="px-3 data-[state=active]:bg-[#1e1f26]"
                  title={category}
                >
                  {getCategoryInitial(category)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {selectedCategory && (
          <>
            {isLoading ? (
              <LoadingTable />
            ) : (
              <Table>
                <TableHeader className="bg-[#1e1f26]">
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{generateTableRows(selectedCategory)}</TableBody>
              </Table>
            )}
          </>
        )}
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
