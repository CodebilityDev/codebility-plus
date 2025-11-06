"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { MessageSquareText } from "lucide-react";
import { shallow } from "zustand/shallow";

import { getSocialPoints } from "../_services/action";

export default function SocialPointsCard() {
  const posts = useFeedsStore((state) => state.posts, shallow);
  const { user } = useUserStore();
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSocialPoints = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const fetchedPoints = await getSocialPoints(user.id);
        setPoints(fetchedPoints || 0);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSocialPoints();
  }, [user, posts]);

  return (
    <div className="dark:bg-white/3 relative mt-4 w-full rounded-xl border border-white/10 bg-gray-800 p-4 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg dark:border-white/5 xl:fixed xl:right-6 xl:top-20 xl:z-50 xl:mt-0 xl:w-64">
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
                </p>
                <p className="text-xs text-gray-500">points</p>
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
