"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";
import { Skeleton } from "@codevs/ui/skeleton";

const TeamMemberSkeleton = ({ delay = 0 }: { delay?: number }) => (
  <Card className="h-32 w-36 overflow-hidden border-2 border-gray-200 shadow-lg dark:border-gray-700 animate-pulse" style={{ animationDelay: `${delay}s` }}>
    <CardContent className="flex h-full flex-col items-center justify-center gap-1 p-2">
      <div className="relative overflow-hidden">
        <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div 
          className="absolute inset-0 h-12 w-12 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer -translate-x-full" 
          style={{ animationDelay: `${delay + 0.5}s` }}
        />
      </div>
      <div className="text-center space-y-1 w-full">
        <div className="relative overflow-hidden">
          <Skeleton className="h-3 w-20 mx-auto bg-gray-200 dark:bg-gray-700" />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer -translate-x-full" 
            style={{ animationDelay: `${delay + 0.7}s` }}
          />
        </div>
        <div className="relative overflow-hidden">
          <Skeleton className="h-2 w-16 mx-auto bg-gray-200 dark:bg-gray-700" />
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer -translate-x-full" 
            style={{ animationDelay: `${delay + 0.9}s` }}
          />
        </div>
      </div>
    </CardContent>
  </Card>
);

const DepartmentSkeleton = ({ title, memberCount = 3, color }: { title: string; memberCount?: number; color: string }) => (
  <div className="flex flex-col items-center">
    <Card className="mb-4 w-full max-w-sm overflow-hidden border-0 shadow-lg">
      <CardContent className={`bg-gradient-to-r ${color} p-2 text-center`}>
        <p className="text-sm font-bold text-white">{title}</p>
      </CardContent>
    </Card>
    <div className="relative mb-4">
      <div className="h-6 w-1 bg-gradient-to-b from-gray-400 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
    </div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {Array.from({ length: memberCount }).map((_, index) => (
        <TeamMemberSkeleton key={index} delay={index * 0.1} />
      ))}
    </div>
  </div>
);

const DeveloperTeamSkeleton = ({ title, memberCount = 4, color }: { title: string; memberCount?: number; color: string }) => (
  <div className="flex flex-col items-center">
    <Card className="mb-4 w-full max-w-md overflow-hidden border-0 shadow-lg">
      <CardContent className={`bg-gradient-to-r ${color} p-2 text-center`}>
        <p className="text-sm font-bold text-white">{title}</p>
      </CardContent>
    </Card>
    <div className="relative mb-4">
      <div className="h-6 w-1 bg-gradient-to-b from-gray-400 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
      <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
    </div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {Array.from({ length: memberCount }).map((_, index) => (
        <TeamMemberSkeleton key={index} delay={index * 0.1} />
      ))}
    </div>
  </div>
);

export default function OrgChartSkeleton() {
  return (
    <div className="mx-auto w-full">
      <CardHeader className="mb-8 text-center">
        <CardTitle className="bg-gradient-to-r from-customBlue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          CODEBILITY
        </CardTitle>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Organizational Chart</p>
      </CardHeader>

      {/* CEO Section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative">
          <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 opacity-20 blur-lg animate-pulse" />
          <TeamMemberSkeleton delay={0.2} />
        </div>
        <div className="relative my-4">
          <div className="h-8 w-1 bg-gradient-to-b from-gray-400 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
          <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
        </div>
      </div>

      {/* Admin, Marketing, PM Section */}
      <div className="relative mb-8">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        <div className="grid w-full grid-cols-1 gap-6 pt-6 md:grid-cols-3">
          <DepartmentSkeleton 
            title="ADMIN" 
            memberCount={2} 
            color="from-customBlue-500 to-cyan-500" 
          />
          <DepartmentSkeleton 
            title="MARKETING" 
            memberCount={1} 
            color="from-purple-500 to-pink-500" 
          />
          <DepartmentSkeleton 
            title="PROJECT MANAGERS" 
            memberCount={2} 
            color="from-green-500 to-emerald-500" 
          />
        </div>
      </div>

      {/* Developers Section */}
      <div className="relative">
        <div className="absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        <div className="grid w-full grid-cols-1 gap-8 pt-6 md:grid-cols-2 xl:grid-cols-3">
          <DeveloperTeamSkeleton 
            title="FULL STACK DEVELOPERS" 
            memberCount={6} 
            color="from-indigo-500 to-customBlue-500" 
          />
          <DeveloperTeamSkeleton 
            title="FRONTEND DEVELOPERS" 
            memberCount={4} 
            color="from-customTeal-500 to-green-500" 
          />
          <DeveloperTeamSkeleton 
            title="BACKEND DEVELOPERS" 
            memberCount={3} 
            color="from-orange-500 to-red-500" 
          />
          <DeveloperTeamSkeleton 
            title="MOBILE DEVELOPERS" 
            memberCount={2} 
            color="from-purple-500 to-pink-500" 
          />
          <DeveloperTeamSkeleton 
            title="UI/UX DESIGNERS" 
            memberCount={3} 
            color="from-customViolet-500 to-purple-500" 
          />
        </div>
      </div>
    </div>
  );
}
