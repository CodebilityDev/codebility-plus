"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWeeklyLeaderboard, LeaderboardMember } from "../leaderboard/actions";

interface Contributor {
  id: string;
  name: string;
  total_points: number;
  image_url: string | null;
}

interface Top3ShowcaseProps {
  projectId: string;
}

export default function Top3Showcase({ projectId }: Top3ShowcaseProps) {
  const [leaders, setLeaders] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setError(false);
      try {
        const result = await getWeeklyLeaderboard(projectId);
        if (result.success && result.data.length > 0) {
          setLeaders(result.data.slice(0, 3));
        } else if (!result.success) {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaderboard();
  }, [projectId]);

  const LeaderboardSkeleton = () => (
    <div className="flex flex-col gap-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-xl p-3 md:p-4 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700/50" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700/50 rounded" />
            </div>
          </div>
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700/50 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800/50 p-6 shadow-sm border border-gray-200 dark:border-gray-700/50 flex-1 group hover:border-customBlue-500/30 transition-all duration-500">
        
        {/* Codebility Boomerang Backdrop */}
        <div className="absolute -right-4 -bottom-4 opacity-[0.10] dark:opacity-[0.08] pointer-events-none scale-150 rotate-[-15deg] group-hover:scale-[1.6] group-hover:rotate-[-10deg] transition-all duration-700">
          <Image src="/assets/svgs/icon-codebility.svg" width={180} height={180} alt="" className="object-contain" />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-black leading-tight tracking-tight text-gray-900 dark:text-white uppercase italic">
                Team<br />Leaderboard
              </h2>
              <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-[0.2em]">
                Weekly Performance
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-300 to-amber-600 p-2.5 rounded-xl shadow-[0_5px_20px_rgba(250,204,21,0.2)]">
              <Trophy className="h-7 w-7 text-yellow-950" />
            </div>
          </div>

          {isLoading ? (
            <LeaderboardSkeleton />
          ) : leaders.length > 0 ? (
            <div className="flex flex-col gap-3">
              {leaders.map((leader, index) => {
                const isFirst = index === 0;
                const bgClass = isFirst
                  ? "bg-yellow-500/10 border-yellow-500/20 shadow-[0_4px_15px_rgba(234,179,8,0.05)]"
                  : "bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-transparent";

                return (
                  <div key={leader.id} className={`flex items-center justify-between rounded-xl p-3 md:p-4 border transition-all duration-300 ${bgClass}`}>
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className={`relative h-10 w-10 shrink-0 rounded-full border-2 overflow-hidden ${isFirst ? "border-yellow-500" : "border-gray-200 dark:border-gray-700"}`}>
                        <Image
                          src={leader.image_url || "/assets/images/default-avatar-200x200.jpg"}
                          alt={leader.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/images/default-avatar-200x200.jpg";
                          }}
                        />
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-tl-lg flex items-center justify-center text-[8px] font-black ${isFirst ? "bg-yellow-500 text-yellow-950" : "bg-gray-800 text-gray-300"}`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`font-bold text-sm md:text-base tracking-tight block truncate ${isFirst ? "text-yellow-400" : "text-gray-900 dark:text-gray-200"}`}>
                          {leader.name}
                        </span>
                        <div className={`text-[9px] font-black uppercase leading-none mt-1 italic ${isFirst ? "text-yellow-400" : "text-gray-400"}`}>
                          {index === 0 ? "Top Performer" : index === 1 ? "Runner Up" : "Third Place"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-950/50 rounded-lg border border-gray-100 dark:border-gray-800/50 shadow-sm shrink-0">
                      <span className={`text-sm font-black ${isFirst ? "text-yellow-400" : "text-gray-900 dark:text-white"}`}>
                        {leader.total_points.toLocaleString()}
                      </span>
                      <span className="text-[8px] font-black text-gray-400">PTS</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
              <User className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-widest">No Activity Recorded</p>
            </div>
          )}

          {!isLoading && leaders.length > 0 && (
            <div className="mt-5 text-center">
              <Link href={`/home/my-team/${projectId}/leaderboard`} className="text-xs font-bold uppercase tracking-widest text-customBlue-500 hover:text-customBlue-600 hover:underline transition-all">
                View all
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
