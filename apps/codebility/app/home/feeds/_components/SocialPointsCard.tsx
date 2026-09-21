"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/codev-store";
import { MessageSquareText } from "lucide-react";

import { getSocialPoints } from "@/actions/feeds/post";

export default function SocialPointsCard() {
  const userId = useUserStore((state) => state.user?.id ?? null);

  const { data: points, isPending: loading } = useQuery({
    queryKey: ["feeds", "socialPoints", userId],
    enabled: Boolean(userId),
    queryFn: () => getSocialPoints(userId!),
  });

  return (
    <div className="dark:bg-white/3 relative mt-4 mb-4 w-full rounded-xl border border-white/10 bg-gray-800 p-4 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 xl:fixed xl:right-6 xl:top-20 xl:z-50 xl:mt-0 xl:w-64">
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2 text-white">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-300">Social Points</p>
              <p className="text-xs text-gray-500">Feed Engagement</p>
            </div>
          </div>

          <div className="text-right">
            {loading ? (
              <div className="flex justify-end">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
              </div>
            ) : (
              <>
                <p className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-2xl font-bold text-transparent">
                  {points ?? 0} 
                <span className="text-xs text-gray-500">points</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Earn more points by posting and getting likes and comments!
          </p>
        </div>
      </div>
    </div>
  );
}
