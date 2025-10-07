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
import { Trophy, Medal, Award, Heart, Calendar, UserRoundPen, Users } from "lucide-react";
import { Skeleton } from "@codevs/ui/skeleton";

interface SoftSkillsLeader {
  codev_id: string;
  first_name: string;
  attendance_points: number;
  profile_points: number;
  total_points: number;
}

const LoadingTable = () => {
  return (
    <Table>
      <TableHeader className="bg-gradient-to-r from-emerald-900 to-teal-800 dark:from-emerald-800 dark:to-teal-900">
        <TableRow className="border-0">
          <TableHead className="text-white font-semibold">Rank</TableHead>
          <TableHead className="text-white font-semibold">Name</TableHead>
          <TableHead className="text-white font-semibold">Attendance</TableHead>
          <TableHead className="text-white font-semibold">Profile</TableHead>
          <TableHead className="text-white font-semibold">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(10)].map((_, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
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

export default function DashboardSoftSkillsLeaderboard() {
  const [leaders, setLeaders] = useState<SoftSkillsLeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoftSkillsLeaderboard = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/soft-skills-leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch soft skills leaderboard');
        }
        
        const data = await response.json();
        setLeaders(data.leaders || []);
      } catch (error) {
        console.error("Error fetching soft skills leaderboard:", error);
        setError("Failed to load leaderboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSoftSkillsLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
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
  };

  const getRowStyle = (rank: number) => {
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

  const generateTableRows = () => {
    const rows: React.ReactNode[] = [];
    const maxPoints = leaders.length > 0 ? Math.max(...leaders.map(l => l.total_points)) : 0;
    
    for (let i = 0; i < 10; i++) {
      const leader = leaders[i];
      const hasData = leader && leader.total_points > 0;
      
      rows.push(
        <TableRow key={i} className={`${getRowStyle(i + 1)} transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${i <= 2 ? 'animate-pulse [animation-duration:3s]' : ''}`}>
          <TableCell className="flex items-center gap-2">
            {getRankIcon(i + 1)}
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
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {hasData ? leader.attendance_points : 0}
              </span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <UserRoundPen className="h-4 w-4 text-orange-500" />
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {hasData ? leader.profile_points : 0}
              </span>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                {hasData ? leader.total_points : 0}
              </span>
              {hasData && (
                <div className="relative h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                    style={{ width: `${Math.min((leader.total_points / maxPoints) * 100, 100)}%` }}
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

  if (error) {
    return (
      <Box className="relative overflow-hidden">
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </Box>
    );
  }

  return (
    <Box className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20" />
      <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/20 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-400/20 blur-xl" />
      
      <div className="relative flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                🏅 Soft Skills Leaderboard
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Consistency & Profile Completion Champions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4 text-emerald-500" />
            <span>Team Leaders</span>
          </div>
        </div>

        {isLoading ? (
          <LoadingTable />
        ) : leaders.length > 0 ? (
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
                      <Calendar className="h-4 w-4" />
                      Attendance
                    </div>
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    <div className="flex items-center gap-2">
                      <UserRoundPen className="h-4 w-4" />
                      Profile
                    </div>
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Total
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-950">
                {generateTableRows()}
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
      </div>
    </Box>
  );
}