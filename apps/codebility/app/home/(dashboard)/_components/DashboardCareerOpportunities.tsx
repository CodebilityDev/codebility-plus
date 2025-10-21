"use client";

import { ArrowRight, Briefcase, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@codevs/ui/button";
import Box from "@/components/shared/dashboard/Box";
import { useUserStore } from "@/store/codev-store";

export default function DashboardCareerOpportunities() {
  const { user } = useUserStore();
  
  // Check if user is a Codev (role_id = 10)
  const isCodev = user?.role_id === 10;

  return (
    <Box className="relative overflow-hidden !bg-white/5 !backdrop-blur-2xl !border-white/10 !shadow-2xl dark:!bg-slate-900/5 dark:!border-slate-400/10 !before:absolute !before:inset-0 !before:bg-gradient-to-br !before:from-white/10 !before:to-transparent !before:pointer-events-none">
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-customBlue-50/50 to-purple-50/50 dark:from-customBlue-950/20 dark:to-purple-950/20" />
      
      {/* Background gradient decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-xl" />
        <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-xl" />
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 shadow-lg">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Career Opportunities
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Exclusive opportunities for Codevs
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="group relative overflow-hidden rounded-xl border border-white/10 dark:border-white/5 bg-white/5 backdrop-blur-sm dark:bg-white/3 p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-white/10 dark:hover:bg-white/5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Growth</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                Career Paths
              </p>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl border border-white/10 dark:border-white/5 bg-white/5 backdrop-blur-sm dark:bg-white/3 p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:bg-white/10 dark:hover:bg-white/5">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-gray-600 dark:text-gray-400">Premium</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                Opportunities
              </p>
            </div>
          </div>

          {/* Description */}
          <div className={`rounded-xl p-4 border backdrop-blur-sm ${
            isCodev 
              ? "bg-gradient-to-r from-emerald-800/80 to-teal-800/80 dark:from-emerald-800/60 dark:to-teal-900/60 border-white/20 dark:border-white/10"
              : "bg-gradient-to-r from-slate-800/80 to-slate-900/80 dark:from-slate-800/60 dark:to-slate-900/60 border-white/20 dark:border-white/10"
          }`}>
            <p className="text-sm text-white/90 dark:text-white/80 mb-3">
              {isCodev ? (
                <>🚀 Unlock exclusive career opportunities designed specifically for experienced Codevs. 
                Explore senior positions, leadership roles, and high-impact projects.</>
              ) : (
                <>🔒 Exclusive career opportunities available for verified Codev members. 
                Complete your journey to unlock premium career paths and opportunities.</>
              )}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-white/70 dark:text-white/60">
              <span className="inline-flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isCodev ? 'bg-white/80' : 'bg-white/40'}`}></span>
                Senior Roles
              </span>
              <span className="inline-flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isCodev ? 'bg-white/80' : 'bg-white/40'}`}></span>
                Leadership Tracks
              </span>
              <span className="inline-flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isCodev ? 'bg-white/80' : 'bg-white/40'}`}></span>
                Remote Work
              </span>
            </div>
          </div>

          {/* CTA Button */}
          {isCodev ? (
            <Link href="/careers" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
                size="sm"
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Career Opportunities
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </Link>
          ) : (
            <Button 
              className="w-full bg-gray-400 dark:bg-gray-600 text-gray-600 dark:text-gray-400 cursor-not-allowed shadow-lg"
              size="sm"
              disabled
            >
              <span className="flex items-center justify-center gap-2">
                🔒 Become a Codev to Access
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          )}

          {/* Footer note */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {isCodev 
              ? "Available exclusively for verified Codev members" 
              : "Complete your journey to become a verified Codev member"
            }
          </p>
        </div>
      </div>
    </Box>
  );
}