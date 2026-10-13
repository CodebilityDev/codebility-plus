"use client";
import type { ProgressBarProps } from "@/types/applicant/profile/profile";

export const ProgressBar = ({ 
  percentage, 
  className = "",
  showLabel = true,
  size = "default"
}: ProgressBarProps) => {
  const heights = {
    small: "h-2",
    default: "h-3",
    large: "h-4"
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`bg-gray-700 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-400">Profile Completion</span>
          <span className="text-xs font-medium text-white">{percentage}%</span>
        </div>
      )}
    </div>
  );
};
