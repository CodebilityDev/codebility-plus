import Image from "next/image";
import { Trophy, Medal, ArrowLeft, Crown, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMembers, getUserProjects } from "../../../projects/actions";
import { createClientServerComponent } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import CustomBreadcrumb from "@/components/shared/dashboard/CustomBreadcrumb";
import LeaderboardSort from "./_components/LeaderboardSort";
import { getLeaderboardData, LeaderboardTimeRange } from "./actions";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { projectId } = await params;
  const { range } = await searchParams;
  const timeRange = (range as LeaderboardTimeRange) || "this-week";

  // 1. Validate Auth & Project Access
  const supabase = await createClientServerComponent();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const userProjectsResponse = await getUserProjects();
  const projectRef = userProjectsResponse.data?.find((p) => p.project.id === projectId);

  if (!projectRef && process.env.NODE_ENV !== "development") {
    notFound();
  }

  const projectName = projectRef?.project.name || "Project Team";

  // 2. Fetch Leaderboard Data with range
  const leaderboardResult = await getLeaderboardData(projectId, timeRange);
  const leaderboardData = leaderboardResult.data || [];

  const breadcrumbItems = [
    { label: "My Team", href: "/home/my-team" },
    { label: projectName, href: `/home/my-team/${projectId}` },
    { label: "Leaderboard" }
  ];

  const top3 = leaderboardData.slice(0, 3);
  const restOfTeam = leaderboardData.slice(3);

  const rangeLabels: Record<LeaderboardTimeRange, string> = {
    "this-week": "This Week",
    "last-week": "Last Week",
    "this-month": "This Month",
    "last-month": "Last Month"
  };

  return (
    <div className="flex w-full flex-col p-4 md:p-8 relative min-h-screen">
      {/* Header and Breadcrumbs */}
      <div className="mb-2 flex flex-col gap-4 relative z-20">
        <CustomBreadcrumb items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-black italic tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              {rangeLabels[timeRange]} Rank
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
               {projectName} • Performance Dashboard
            </p>
          </div>

          <LeaderboardSort currentRange={timeRange} />

          <div className="flex items-center gap-2">
            {projectRef?.role === "team_leader" && (
              <Link href={`/home/my-team/${projectId}`}>
                <Button variant="outline" className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative z-30 px-6 py-2 rounded-xl font-semibold">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Leaderboard Canvas */}
      <div className="relative w-full mt-4 md:mt-8">

        {/* BACKDROP LOGO: CODEBILITY */}
        <div className="absolute inset-0 top-36 flex flex-col items-center pointer-events-none select-none z-0 overflow-hidden" style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}>
          <div className="relative w-[100vw] md:w-[90vw] aspect-[5/1] opacity-[0.3] dark:opacity-[0.3]">
            <Image
              src="/assets/svgs/logos/codebility-light.svg"
              alt="Codebility"
              fill
              className="object-contain hidden dark:block"
              priority
            />
            <Image
              src="/assets/svgs/logos/codebility-dark.svg"
              alt="Codebility"
              fill
              className="object-contain block dark:hidden"
              priority
            />
          </div>
          <div className="mt-[-2vw]">
            <span className="text-[2.5vw] font-bold text-gray-400 dark:text-gray-600 opacity-[0.15] dark:opacity-[0.25] tracking-[1.2em] uppercase">
              PERFORMERS
            </span>
          </div>
        </div>

        {/* TOP 3 SHOWCASE CARDS */}
        <div className="relative z-10 flex flex-col md:flex-row justify-center items-stretch md:items-center gap-6 md:gap-8 mb-12 md:mb-16 pt-8 md:pt-24 px-4 overflow-x-hidden">

          {top3.map((codev, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const rankLabel = isFirst ? "1st" : isSecond ? "2nd" : "3rd";

            const gradientClass = isFirst
              ? "bg-gradient-to-br from-yellow-50 via-amber-100 to-yellow-300 dark:from-yellow-900/40 dark:via-amber-800/20 dark:to-yellow-700/40 border-yellow-300 dark:border-yellow-600/50 text-gray-900"
              : isSecond
                ? "bg-gradient-to-br from-gray-50 via-slate-100 to-gray-300 dark:from-gray-800/40 dark:via-slate-700/20 dark:to-gray-600/40 border-gray-300 dark:border-gray-500/50 text-gray-900 dark:text-white"
                : "bg-gradient-to-br from-orange-50 via-orange-100 to-amber-200 dark:from-orange-900/40 dark:via-orange-800/20 dark:to-amber-700/40 border-orange-300 dark:border-orange-600/50 text-gray-900 dark:text-white";

            return (
              <div key={codev.id} className={`flex flex-col relative w-full md:max-w-[280px] rounded-[24px] md:rounded-[32px] p-5 md:p-6 shadow-xl md:shadow-2xl backdrop-blur-md border ${gradientClass} transition-transform hover:-translate-y-2 duration-300`}>

                <div className="absolute top-6 right-8 text-5xl font-black text-black/10 dark:text-white/20 italic select-none">
                  {rankLabel}
                </div>

                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-[4px] md:border-[6px] border-white/60 dark:border-gray-900/60 shadow-lg flex items-center justify-center bg-white dark:bg-gray-800 overflow-hidden mx-auto z-10 mt-1 md:mt-2">
                      {codev.image_url ? (
                        <Image
                          src={codev.image_url}
                          alt={codev.name}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-8 w-8 md:h-12 md:w-12 text-gray-400" />
                      )}
                    </div>
    
                    <div className="text-center mt-6">
                      <h3 className="font-black text-gray-900 dark:text-white text-2xl uppercase italic truncate">
                        {codev.name.split(" ").slice(0, 2).join(" ")}
                      </h3>
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] mt-2 ${isFirst ? "text-yellow-600 dark:text-yellow-400" : "text-blue-600 dark:text-blue-400"}`}>
                        {isFirst ? "MVP OF THE WEEK" : "ELITE CONTRIBUTOR"}
                      </div>
                    </div>
    
                    <div className="mt-4 md:mt-6 flex justify-center">
                      <div className="bg-white dark:bg-gray-900 px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-2.5 shadow-md border border-gray-100 dark:border-gray-800">
                        <Trophy className={`h-3 w-3 md:h-4 md:w-4 ${isFirst ? "text-yellow-500" : isSecond ? "text-slate-400" : "text-amber-600"}`} />
                        <span className="font-black text-gray-900 dark:text-white text-base md:text-lg">{codev.total_points.toLocaleString()}</span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">pts</span>
                      </div>
                    </div>
              </div>
            );
          })}
        </div>

        {/* LIST SECTION FOR ALL RANKS */}
        <div className="relative z-10 w-full max-w-5xl mx-auto bg-white/50 dark:bg-gray-950/40 backdrop-blur-xl rounded-[24px] md:rounded-[32px] p-2 md:p-6 shadow-2xl border border-gray-200 dark:border-gray-800 mb-8">

          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 md:gap-4 px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800/80 mb-2">
            <div className="col-span-2 md:col-span-1 text-center">Rank</div>
            <div className="col-span-6 md:col-span-5">Codev</div>
            <div className="hidden md:block md:col-span-3 text-center">Role</div>
            <div className="col-span-4 md:col-span-3 text-right pr-2 md:pr-0">Total Points</div>
          </div>

          <div className="flex flex-col gap-2 md:gap-3">
            {leaderboardData.map((codev, index) => {
              const isTop3 = index < 3;
              const rankColor =
                index === 0 ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-400/5 border-yellow-200 dark:border-yellow-400/10" :
                  index === 1 ? "text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-300/5 border-gray-200 dark:border-gray-300/10" :
                    index === 2 ? "text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/10" :
                      "text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-900/30 border-transparent dark:border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50";

              return (
                <div
                  key={codev.id}
                  className={`grid grid-cols-12 gap-2 md:gap-4 items-center px-3 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border transition-all duration-200 ${rankColor}`}
                >
                  {/* Rank */}
                  <div className="col-span-2 md:col-span-1 flex justify-center text-base md:text-xl font-black italic">
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div className="col-span-6 md:col-span-5 flex items-center gap-2 md:gap-4">
                    <div className="h-8 w-8 md:h-10 md:w-10 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800 border border-white dark:border-gray-700 flex items-center justify-center overflow-hidden">
                      {codev.image_url ? (
                        <Image
                          src={codev.image_url}
                          alt={codev.name}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-4 w-4 md:h-6 md:w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-gray-900 dark:text-gray-100 text-sm md:text-lg truncate">
                        {codev.name}
                      </div>
                      {isTop3 && (
                        <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider opacity-60 mt-0.5">
                          {index === 0 ? "Top Performer" : index === 1 ? "Runner Up" : "Third Place"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="hidden md:flex md:col-span-3 justify-center items-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm">
                      {codev.role}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="col-span-4 md:col-span-3 flex justify-end items-center gap-1 md:gap-2 pr-1 md:pr-0">
                    <div className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg flex items-center gap-1 md:gap-1.5 shadow-sm border ${isTop3
                        ? "bg-gray-900 text-white border-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:border-white"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      }`}>
                      <span className="font-black text-xs md:text-base pt-0.5">{codev.total_points.toLocaleString()}</span>
                      <span className={`text-[8px] md:text-[10px] font-bold ${isTop3 ? "opacity-60" : "text-gray-500"}`}>PTS</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
