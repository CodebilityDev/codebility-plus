"use client";

import { useEffect, useState } from "react";
import Box from "@/components/shared/dashboard/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClientClientComponent } from "@/utils/supabase/client";
import { startOfMonth, startOfWeek, subDays } from "date-fns";
import { Trophy, Medal, Award, Star, Zap } from "lucide-react";

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  // NEW: Rank-specific lightning icon function
  const getRankLightningIcon = (rank: number) => {
    switch (rank) {
      case 1:
        // Violet lightning for rank 1 (top performer)
        return (
          <div title="Top Performer!">
            <Zap className="h-4 w-4 text-violet-500 animate-bounce" />
          </div>
        );
      case 2:
      case 3:
        // Yellow lightning for ranks 2 and 3
        return (
          <div title="High Achiever!">
            <Zap className="h-4 w-4 text-yellow-500 animate-bounce" />
          </div>
        );
      default:
        // No lightning icon for ranks 4-10
        return null;
    }
  };

  const getPointsBar = (points: number, maxPoints: number) => {
    const percentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
    return (
      <div className="relative h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-customBlue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    );
  };

  const generateTableRows = (category: string) => {
    const rows: React.ReactNode[] = [];
    const categoryPoints = categoryData[category] || [];
    const maxPoints = categoryPoints.length > 0 ? Math.max(...categoryPoints.map(d => d.points)) : 0;
    
    for (let i = 0; i < 10; i++) {
      const data = categoryData[category]?.[i];
      const hasData = data && data.points > 0;
      
      rows.push(
        <TableRow key={i} className={`${getRowStyle(i + 1)} transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${i <= 2 ? 'animate-pulse [animation-duration:3s]' : ''}`}>
          <TableCell className="flex items-center gap-2">
            {getRankIcon(i + 1)}
            <span className="font-semibold">{i + 1}</span>
          </TableCell>
          <TableCell className="font-medium">
            {hasData ? (
              <div className="flex items-center gap-2">
                <span>{data.codev?.first_name || "Unknown"}</span>
                {/* UPDATED: Rank-specific lightning icon logic */}
                {getRankLightningIcon(i + 1)}
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <span className="font-bold text-customBlue-600 dark:text-customBlue-400">
                {hasData ? data.points : 0}
              </span>
              {hasData && getPointsBar(data.points, maxPoints)}
            </div>
          </TableCell>
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
    <Box className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-50/50 to-purple-50/50 dark:from-customBlue-950/20 dark:to-purple-950/20" />
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl" />
      
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🏆 Leaderboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Compete and climb the ranks!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Top Performers</span>
          </div>
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
            <TabsList className="grid h-10 grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {allCategories.map((category) => {
                const getCategoryStyle = () => {
                  if (selectedCategory !== category) return "";
                  
                  switch (category) {
                    case "Frontend Developer":
                      return "data-[state=active]:bg-customBlue-600 data-[state=active]:text-white";
                    case "Backend Developer":
                      return "data-[state=active]:bg-green-600 data-[state=active]:text-white";
                    case "UI/UX Designer":
                      return "data-[state=active]:bg-purple-600 data-[state=active]:text-white";
                    case "Mobile Developer":
                      return "data-[state=active]:bg-orange-600 data-[state=active]:text-white";
                    case "QA Engineer":
                      return "data-[state=active]:bg-indigo-600 data-[state=active]:text-white";
                    default:
                      return "data-[state=active]:bg-gray-600 data-[state=active]:text-white";
                  }
                };

                return (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className={`px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 ${getCategoryStyle()}`}
                    title={category}
                  >
                    {getCategoryInitial(category)}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {selectedCategory && (
          <>
            {isLoading ? (
              <LoadingTable />
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900">
                    <TableRow className="border-0">
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Rank
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Developer
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Points
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white dark:bg-gray-950">
                    {generateTableRows(selectedCategory)}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </Box>
  );
}

const getRowStyle = (rank: number) => {
  const styles = {
    1: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/25 border-yellow-300",
    2: "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg shadow-gray-400/25 border-gray-300",
    3: "bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-lg shadow-amber-600/25 border-amber-500",
  } as const;

  const baseStyle = styles[rank as keyof typeof styles];
  
  if (baseStyle) {
    return `${baseStyle} border border-l-4`;
  }
  
  return "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800";
};