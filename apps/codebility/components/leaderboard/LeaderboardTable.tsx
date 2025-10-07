"use client";

import React, { memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trophy, Medal, Award, Star, Users, Calendar, UserRoundPen } from "lucide-react";
import { TechnicalLeader, SoftSkillsLeader, ProjectLeader, LeaderboardType } from "@/types/leaderboard";

interface LeaderboardTableProps {
  type: LeaderboardType;
  data: (TechnicalLeader | SoftSkillsLeader | ProjectLeader)[];
  isLoading: boolean;
  maxRows?: number;
}

const LeaderboardTable = memo<LeaderboardTableProps>(({ 
  type, 
  data, 
  isLoading, 
  maxRows = 10 
}) => {
  const getRankIcon = (rank: number, leaderboardType: LeaderboardType) => {
    const iconProps = "h-5 w-5";
    
    if (leaderboardType === "soft-skills") {
      switch (rank) {
        case 1: return <Trophy className={`${iconProps} text-emerald-500`} />;
        case 2: return <Medal className={`${iconProps} text-teal-400`} />;
        case 3: return <Award className={`${iconProps} text-cyan-400`} />;
        default: return <Users className="h-4 w-4 text-gray-400" />;
      }
    }
    
    // Technical and projects use traditional ranking
    switch (rank) {
      case 1: return <Trophy className={`${iconProps} text-yellow-500`} />;
      case 2: return <Medal className={`${iconProps} text-gray-400`} />;
      case 3: return <Award className={`${iconProps} text-amber-600`} />;
      default: return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-l-4 border-gray-400";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-l-4 border-amber-600";
      default:
        return "hover:bg-gray-50 dark:hover:bg-gray-800/50";
    }
  };

  const getSoftSkillsRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500";
      case 2:
        return "bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-800/50 dark:to-cyan-800/50 border-l-4 border-teal-400";
      case 3:
        return "bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-l-4 border-cyan-400";
      default:
        return "hover:bg-gray-50 dark:hover:bg-gray-800/50";
    }
  };

  const getTableHeaders = () => {
    const baseHeaders = [
      {
        key: "rank",
        label: "Rank",
        icon: <Trophy className="h-4 w-4" />
      }
    ];

    switch (type) {
      case "technical":
        return [
          ...baseHeaders,
          {
            key: "developer",
            label: "Developer", 
            icon: <Star className="h-4 w-4" />
          },
          {
            key: "points",
            label: "Points",
            icon: <Star className="h-4 w-4" />
          }
        ];
      case "soft-skills":
        return [
          ...baseHeaders,
          {
            key: "codev",
            label: "Codev",
            icon: <Users className="h-4 w-4" />
          },
          {
            key: "breakdown",
            label: "Points Breakdown",
            icon: <Users className="h-4 w-4" />
          }
        ];
      case "projects":
        return [
          ...baseHeaders,
          {
            key: "project",
            label: "Project",
            icon: <Trophy className="h-4 w-4" />
          },
          {
            key: "points",
            label: "Team Points",
            icon: <Trophy className="h-4 w-4" />
          }
        ];
      default:
        return baseHeaders;
    }
  };

  const renderTableRow = (item: TechnicalLeader | SoftSkillsLeader | ProjectLeader, index: number) => {
    const rank = index + 1;
    const rowStyle = type === "soft-skills" ? getSoftSkillsRowStyle(rank) : getRowStyle(rank);
    
    return (
      <TableRow 
        key={`${type}-${index}`} 
        className={`${rowStyle} transition-all duration-200 hover:scale-[1.01] hover:shadow-md ${rank <= 3 ? 'animate-pulse [animation-duration:3s]' : ''}`}
      >
        <TableCell className="flex items-center gap-2">
          {getRankIcon(rank, type)}
          <span className="font-semibold">{rank}</span>
        </TableCell>
        
        {type === "technical" && (
          <>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <span>{(item as TechnicalLeader).first_name}</span>
                {rank <= 3 && <Star className="h-4 w-4 text-yellow-400 animate-bounce" />}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span className="font-bold text-customBlue-600 dark:text-customBlue-400">
                  {(item as TechnicalLeader).total_points}
                </span>
                <div className="relative h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-customBlue-500 to-purple-500 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((item as TechnicalLeader).total_points / Math.max(...data.map(d => (d as TechnicalLeader).total_points || 0))) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </TableCell>
          </>
        )}

        {type === "soft-skills" && (
          <>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <span>{(item as SoftSkillsLeader).first_name}</span>
                {rank <= 3 && <Users className="h-4 w-4 text-emerald-400 animate-bounce" />}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <div className="flex flex-col items-center min-w-[45px]">
                  <div className="flex items-center gap-0.5">
                    <Calendar className="h-2.5 w-2.5 text-blue-500" />
                    <span className="text-xs text-gray-500">A</span>
                  </div>
                  <span className="font-medium text-blue-600 dark:text-blue-400 text-xs">
                    {(item as SoftSkillsLeader).attendance_points}
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[45px]">
                  <div className="flex items-center gap-0.5">
                    <UserRoundPen className="h-2.5 w-2.5 text-orange-500" />
                    <span className="text-xs text-gray-500">P</span>
                  </div>
                  <span className="font-medium text-orange-600 dark:text-orange-400 text-xs">
                    {(item as SoftSkillsLeader).profile_points}
                  </span>
                </div>
                <div className="flex flex-col items-center min-w-[55px]">
                  <span className="text-xs text-gray-500">Total</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      {(item as SoftSkillsLeader).total_points}
                    </span>
                    <div className="relative h-1 w-8 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                        style={{ 
                          width: `${Math.min(((item as SoftSkillsLeader).total_points / Math.max(...data.map(d => (d as SoftSkillsLeader).total_points || 0))) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TableCell>
          </>
        )}

        {type === "projects" && (
          <>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <span>📂 {(item as ProjectLeader).project_name}</span>
                {rank <= 3 && <Star className="h-4 w-4 text-yellow-400 animate-bounce" />}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span className="font-bold text-customBlue-600 dark:text-customBlue-400">
                  {(item as ProjectLeader).total_points}
                </span>
                <div className="relative h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-customBlue-500 to-purple-500 transition-all duration-300"
                    style={{ 
                      width: `${Math.min(((item as ProjectLeader).total_points / Math.max(...data.map(d => (d as ProjectLeader).total_points || 0))) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </TableCell>
          </>
        )}
      </TableRow>
    );
  };

  const renderLoadingRow = (index: number) => {
    const rank = index + 1;
    const rowStyle = type === "soft-skills" ? getSoftSkillsRowStyle(rank) : getRowStyle(rank);
    
    return (
      <TableRow key={`loading-${index}`} className={`${rowStyle} transition-all duration-200`}>
        <TableCell className="flex items-center gap-2">
          {getRankIcon(rank, type)}
          <span className="font-semibold">{rank}</span>
        </TableCell>
        
        {type === "technical" && (
          <>
            <TableCell className="font-medium">
              <span className="text-gray-400">Loading...</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-400">0</span>
                <div className="relative h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </TableCell>
          </>
        )}

        {type === "soft-skills" && (
          <>
            <TableCell className="font-medium">
              <span className="text-gray-400">Loading...</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <div className="flex flex-col items-center min-w-[45px]">
                  <div className="flex items-center gap-0.5">
                    <Calendar className="h-2.5 w-2.5 text-blue-500" />
                    <span className="text-xs text-gray-500">A</span>
                  </div>
                  <span className="font-medium text-gray-400 text-xs">0</span>
                </div>
                <div className="flex flex-col items-center min-w-[45px]">
                  <div className="flex items-center gap-0.5">
                    <UserRoundPen className="h-2.5 w-2.5 text-orange-500" />
                    <span className="text-xs text-gray-500">P</span>
                  </div>
                  <span className="font-medium text-gray-400 text-xs">0</span>
                </div>
                <div className="flex flex-col items-center min-w-[55px]">
                  <span className="text-xs text-gray-500">Total</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-400 text-sm">0</span>
                    <div className="relative h-1 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            </TableCell>
          </>
        )}

        {type === "projects" && (
          <>
            <TableCell className="font-medium">
              <span className="text-gray-400">Loading...</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-400">0</span>
                <div className="relative h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </TableCell>
          </>
        )}
      </TableRow>
    );
  };

  const headers = getTableHeaders();

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      <Table 
        role="table"
        aria-label={`${type.replace("-", " ")} leaderboard table`}
        aria-describedby={`${type}-leaderboard-description`}
      >
        <TableHeader className={`bg-gradient-to-r ${
          type === "soft-skills" 
            ? "from-emerald-900 to-teal-800 dark:from-emerald-800 dark:to-teal-900"
            : type === "projects"
            ? "from-purple-900 to-indigo-800 dark:from-purple-800 dark:to-indigo-900"  
            : "from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900"
        }`}>
          <TableRow className="border-0">
            {headers.map((header) => (
              <TableHead key={header.key} className="text-white font-semibold">
                <div className="flex items-center gap-2">
                  {header.icon}
                  {header.label}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white dark:bg-gray-950">
          {isLoading ? (
            Array.from({ length: maxRows }, (_, index) => renderLoadingRow(index))
          ) : (
            data.slice(0, maxRows).map((item, index) => renderTableRow(item, index))
          )}
          
          {/* Fill remaining rows if data is less than maxRows */}
          {!isLoading && data.length < maxRows && 
            Array.from({ length: maxRows - data.length }, (_, index) => renderLoadingRow(data.length + index))
          }
        </TableBody>
      </Table>
    </div>
  );
});

LeaderboardTable.displayName = "LeaderboardTable";

export default LeaderboardTable;