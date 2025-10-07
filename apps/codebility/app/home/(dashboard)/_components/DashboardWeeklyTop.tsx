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
import { Trophy, Medal, Award, Star, Zap, Heart, Users, Calendar, UserRoundPen } from "lucide-react";

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
type LeaderboardType = "technical" | "soft-skills" | "projects";

interface TopCodev {
  points: number;
  codev: {
    first_name: string;
  } | null;
  skill_category: {
    name: string;
  } | null;
}

interface SoftSkillsLeader {
  codev_id: string;
  first_name: string;
  attendance_points: number;
  profile_points: number;
  total_points: number;
}

interface ProjectLeader {
  project_id: string;
  project_name: string;
  total_points: number;
  member_count: number;
  skill_breakdown: Record<string, number>;
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
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>("technical");
  const [softSkillsLeaders, setSoftSkillsLeaders] = useState<SoftSkillsLeader[]>([]);
  const [projectLeaders, setProjectLeaders] = useState<ProjectLeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClientClientComponent();

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("skill_category")
          .select("name")
          .order("name");

        if (!isMounted) return; // Prevent state update if component unmounted

        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }

        if (data) {
          const categories = data.map((cat: { name: string }) => cat.name)
            .filter(name => name !== "Project Manager"); // Exclude PM from technical skills

          // Reorder categories to put important ones first
          const reorderedCategories = [...categories];
          
          // Move Frontend Developer to first position
          const feIndex = reorderedCategories.findIndex(
            (cat) => cat === "Frontend Developer",
          );
          if (feIndex !== -1) {
            const [frontendDev] = reorderedCategories.splice(feIndex, 1);
            reorderedCategories.unshift(frontendDev);
          }
          
          // No soft skills category available due to database constraints

          setAllCategories(reorderedCategories);
          if (!selectedCategory && reorderedCategories.length > 0) {
            setSelectedCategory(reorderedCategories[0]);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error in fetchCategories:", error);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // Fetch soft skills leaderboard
  useEffect(() => {
    if (leaderboardType !== "soft-skills") return;

    let isMounted = true;

    const fetchSoftSkillsLeaderboard = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/soft-skills-leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch soft skills leaderboard');
        }
        
        const data = await response.json();
        if (isMounted) {
          setSoftSkillsLeaders(data.leaders || []);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching soft skills leaderboard:", error);
          setSoftSkillsLeaders([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchSoftSkillsLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [leaderboardType]);

  // Fetch projects leaderboard
  useEffect(() => {
    if (leaderboardType !== "projects") return;

    let isMounted = true;
    const supabase = createClientClientComponent();

    const fetchProjectsLeaderboard = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase
          .from("codev_points")
          .select(
            `
            points,
            codev_id,
            skill_category:skill_category_id!inner(name),
            created_at
          `,
          );

        if (timePeriod === "weekly") {
          const weekStart = startOfWeek(new Date());
          query = query.gte("created_at", weekStart.toISOString());
        } else if (timePeriod === "monthly") {
          const monthStart = startOfMonth(new Date());
          query = query.gte("created_at", monthStart.toISOString());
        }

        const { data, error } = await query;

        if (!isMounted) return;

        if (error) {
          console.error("Error fetching project points:", error);
          return;
        }

        if (data) {
          console.log("Codev points data:", data.slice(0, 3)); // Debug: show first 3 records

          // First, get all projects
          const { data: projects, error: projectsError } = await supabase
            .from("projects")
            .select("id, name");

          if (!isMounted) return;

          if (projectsError) {
            console.error("Error fetching projects:", projectsError);
            setProjectLeaders([]);
            return;
          }

          // Get project members to map codevs to projects
          const { data: projectMembers, error: membersError } = await supabase
            .from("project_members")
            .select("codev_id, project_id");

          if (!isMounted) return;

          if (membersError) {
            console.error("Error fetching project members:", membersError);
            setProjectLeaders([]);
            return;
          }

          console.log("Projects:", projects);
          console.log("Project members:", projectMembers);

          // Create a map of codev_id to project_id
          const codevToProjectMap = new Map<string, string>();
          projectMembers?.forEach((member: any) => {
            codevToProjectMap.set(member.codev_id, member.project_id);
          });

          // Initialize project map with all projects
          const projectMap = new Map<string, {
            project_id: string;
            project_name: string;
            total_points: number;
            members: Set<string>;
            skill_breakdown: Record<string, number>;
          }>();

          projects?.forEach((project: any) => {
            projectMap.set(project.id, {
              project_id: project.id,
              project_name: project.name,
              total_points: 0,
              members: new Set(),
              skill_breakdown: {}
            });
          });

          // Add points to projects based on member assignments
          data.forEach((item: any) => {
            const projectId = codevToProjectMap.get(item.codev_id);
            if (!projectId || !projectMap.has(projectId)) {
              return; // Skip if developer isn't assigned to any project
            }

            const project = projectMap.get(projectId)!;
            const skillCategory = item.skill_category?.name || "Other";
            
            project.total_points += item.points || 0;
            project.members.add(item.codev_id);
            project.skill_breakdown[skillCategory] = (project.skill_breakdown[skillCategory] || 0) + (item.points || 0);
          });

          // Convert to array and sort by total points
          const projectsArray: ProjectLeader[] = Array.from(projectMap.values())
            .map(project => ({
              project_id: project.project_id,
              project_name: project.project_name,
              total_points: project.total_points,
              member_count: project.members.size,
              skill_breakdown: project.skill_breakdown
            }))
            .sort((a, b) => b.total_points - a.total_points)
            .slice(0, 10);

          if (isMounted) {
            setProjectLeaders(projectsArray);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching projects leaderboard:", error);
          setProjectLeaders([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProjectsLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [leaderboardType, timePeriod]);

  useEffect(() => {
    if (allCategories.length === 0 || leaderboardType !== "technical") return;

    let isMounted = true;
    const supabase = createClientClientComponent();

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

          if (isMounted) {
            setCategoryData(groupedData);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error in fetchTopCodevs:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTopCodevs();

    return () => {
      isMounted = false;
    };
  }, [timePeriod, allCategories, leaderboardType]);

  const getRankIcon = (rank: number, isTraditional: boolean = true) => {
    if (!isTraditional) {
      // Soft skills icons
      switch (rank) {
        case 1:
          return <Trophy className="h-5 w-5 text-emerald-500" />;
        case 2:
          return <Medal className="h-5 w-5 text-teal-400" />;
        case 3:
          return <Award className="h-5 w-5 text-cyan-400" />;
        default:
          return <Users className="h-4 w-4 text-gray-400" />;
      }
    }
    
    // Technical skills icons
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
            {getRankIcon(i + 1, true)}
            <span className="font-semibold">{i + 1}</span>
          </TableCell>
          <TableCell className="font-medium">
            {hasData ? (
              <div className="flex items-center gap-2">
                <span>{data.codev?.first_name || "Unknown"}</span>
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

  const generateSoftSkillsTableRows = () => {
    const rows: React.ReactNode[] = [];
    const maxPoints = softSkillsLeaders.length > 0 ? Math.max(...softSkillsLeaders.map(l => l.total_points)) : 0;
    
    for (let i = 0; i < 10; i++) {
      const leader = softSkillsLeaders[i];
      const hasData = leader && leader.total_points > 0;
      
      rows.push(
        <TableRow key={i} className={`${getSoftSkillsRowStyle(i + 1)} transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${i <= 2 ? 'animate-pulse [animation-duration:3s]' : ''}`}>
          <TableCell className="flex items-center gap-2">
            {getRankIcon(i + 1, false)}
            <span className="font-semibold">{i + 1}</span>
          </TableCell>
          <TableCell className="font-medium">
            {hasData ? (
              <div className="flex items-center gap-2">
                <span>{leader.first_name || "Unknown"}</span>
                {i < 3 && <Users className="h-4 w-4 text-emerald-400 animate-bounce" />}
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1">
              <div className="flex flex-col items-center min-w-[45px]">
                <div className="flex items-center gap-0.5">
                  <Calendar className="h-2.5 w-2.5 text-blue-500" />
                  <span className="text-xs text-gray-500">A</span>
                </div>
                <span className="font-medium text-blue-600 dark:text-blue-400 text-xs">
                  {hasData ? leader.attendance_points : 0}
                </span>
              </div>
              <div className="flex flex-col items-center min-w-[45px]">
                <div className="flex items-center gap-0.5">
                  <UserRoundPen className="h-2.5 w-2.5 text-orange-500" />
                  <span className="text-xs text-gray-500">P</span>
                </div>
                <span className="font-medium text-orange-600 dark:text-orange-400 text-xs">
                  {hasData ? leader.profile_points : 0}
                </span>
              </div>
              <div className="flex flex-col items-center min-w-[55px]">
                <span className="text-xs text-gray-500">Total</span>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {hasData ? leader.total_points : 0}
                  </span>
                  {hasData && (
                    <div className="relative h-1 w-8 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                        style={{ width: `${Math.min((leader.total_points / maxPoints) * 100, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }
    return rows;
  };

  const generateProjectTableRows = () => {
    const rows: React.ReactNode[] = [];
    const maxPoints = projectLeaders.length > 0 ? Math.max(...projectLeaders.map(p => p.total_points)) : 0;
    
    for (let i = 0; i < 10; i++) {
      const project = projectLeaders[i];
      const hasData = project && project.total_points > 0;
      
      rows.push(
        <TableRow key={i} className={`${getRowStyle(i + 1)} transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${i <= 2 ? 'animate-pulse [animation-duration:3s]' : ''}`}>
          <TableCell className="flex items-center gap-2">
            {getRankIcon(i + 1, true)}
            <span className="font-semibold">{i + 1}</span>
          </TableCell>
          <TableCell className="font-medium">
            {hasData ? (
              <div className="flex items-center gap-2">
                <span>📂 {project.project_name}</span>
                {getRankLightningIcon(i + 1)}
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <span className="font-bold text-customBlue-600 dark:text-customBlue-400">
                {hasData ? project.total_points : 0}
              </span>
              {hasData && (
                <div className="relative h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-customBlue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${Math.min((project.total_points / maxPoints) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
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
      case "Full Stack Developer":
        return "FS";
      case "Admin":
        return "AD";
      case "Marketing":
        return "MK";
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
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              leaderboardType === "technical" 
                ? "bg-gradient-to-br from-yellow-400 to-orange-500" 
                : "bg-gradient-to-br from-emerald-400 to-teal-500"
            }`}>
              {leaderboardType === "technical" ? (
                <Trophy className="h-5 w-5 text-white" />
              ) : (
                <Users className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <h2 className={`text-2xl font-bold bg-gradient-to-r ${
                leaderboardType === "technical"
                  ? "from-purple-600 to-blue-600"
                  : "from-emerald-600 to-teal-600"
              } bg-clip-text text-transparent`}>
                🏆 Leaderboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {leaderboardType === "technical" ? "Technical skills & expertise" : "Consistency & collaboration"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {leaderboardType === "technical" ? (
              <>
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Top Performers</span>
              </>
            ) : (
              <>
                <Users className="h-4 w-4 text-emerald-500" />
                <span>Team Leaders</span>
              </>
            )}
          </div>
        </div>

        {/* Main tabs for leaderboard type */}
        <div className="flex gap-4 mb-4">
          <Tabs
            value={leaderboardType}
            onValueChange={(value: LeaderboardType) => setLeaderboardType(value)}
            className="w-fit"
          >
            <TabsList className="grid h-10 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit grid-cols-3">
              <TabsTrigger
                value="technical"
                className="px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-customBlue-600 data-[state=active]:text-white"
              >
                <Star className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Technical</span>
                <span className="sm:hidden">Tech</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Trophy className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Projects</span>
                <span className="sm:hidden">Proj</span>
              </TabsTrigger>
              <TabsTrigger
                value="soft-skills"
                className="px-3 rounded-md font-medium transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Soft Skills</span>
                <span className="sm:hidden">Soft</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {/* Technical Skills Controls */}
        {leaderboardType === "technical" && allCategories.length > 0 && (
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
              <TabsList className={`grid h-10 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg`} style={{gridTemplateColumns: `repeat(${allCategories.length}, minmax(0, 1fr))`}}>
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
                      case "Full Stack Developer":
                        return "data-[state=active]:bg-purple-600 data-[state=active]:text-white";
                      case "Admin":
                        return "data-[state=active]:bg-red-600 data-[state=active]:text-white";
                      case "Marketing":
                        return "data-[state=active]:bg-pink-600 data-[state=active]:text-white";
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
        )}

        {/* Projects Controls */}
        {leaderboardType === "projects" && (
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
          </div>
        )}

        {/* Content based on leaderboard type */}
        {leaderboardType === "technical" ? (
          allCategories.length > 0 ? (
            selectedCategory && (
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
            )
          ) : (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Technical Leaderboard Coming Soon!
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Skill categories are being set up. Check back soon to see the rankings!
                  </p>
                  <div className="text-xs text-gray-400">
                    Loading categories...
                  </div>
                </div>
              </div>
            </div>
          )
        ) : leaderboardType === "projects" ? (
          // Projects Leaderboard
          <>
            {isLoading ? (
              <LoadingTable />
            ) : projectLeaders.length > 0 ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-purple-900 to-indigo-800 dark:from-purple-800 dark:to-indigo-900">
                    <TableRow className="border-0">
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Rank
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Project
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Total Points
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white dark:bg-gray-950">
                    {generateProjectTableRows()}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Projects Leaderboard
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      No project data available yet. Projects will appear here once team members earn technical skill points!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Soft Skills Leaderboard
          <>
            {isLoading ? (
              <Table>
                <TableHeader className="bg-gradient-to-r from-emerald-900 to-teal-800 dark:from-emerald-800 dark:to-teal-900">
                  <TableRow className="border-0">
                    <TableHead className="text-white font-semibold">Rank</TableHead>
                    <TableHead className="text-white font-semibold">Name</TableHead>
                    <TableHead className="text-white font-semibold">Points Breakdown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(10)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Skeleton className="h-6 w-12" />
                          <Skeleton className="h-6 w-12" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : softSkillsLeaders.length > 0 ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
                <Table>
                  <TableHeader className="bg-gradient-to-r from-emerald-900 to-teal-800 dark:from-emerald-800 dark:to-teal-900">
                    <TableRow className="border-0">
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Rank
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Codev
                        </div>
                      </TableHead>
                      <TableHead className="text-white font-semibold">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Points Breakdown
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white dark:bg-gray-950">
                    {generateSoftSkillsTableRows()}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                    <Users className="h-8 w-8 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Soft Skills Leaderboard
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      No soft skills data available yet. Complete your profile and maintain good attendance to appear here!
                    </p>
                  </div>
                </div>
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

const getSoftSkillsRowStyle = (rank: number) => {
  const styles = {
    1: "bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 border-emerald-300",
    2: "bg-gradient-to-r from-teal-300 via-teal-400 to-teal-500 text-white shadow-lg shadow-teal-400/25 border-teal-300", 
    3: "bg-gradient-to-r from-cyan-500 via-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-600/25 border-cyan-500",
  } as const;

  const baseStyle = styles[rank as keyof typeof styles];
  
  if (baseStyle) {
    return `${baseStyle} border border-l-4`;
  }
  
  return "hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800";
};