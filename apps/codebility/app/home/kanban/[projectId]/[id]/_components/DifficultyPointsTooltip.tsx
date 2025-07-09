"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Info } from "lucide-react";

const DIFFICULTY_LEVELS = ["very easy", "easy", "normal", "medium", "hard"];

// Difficulty-based points mapping
const DIFFICULTY_POINTS = {
  "very easy": 1,
  "easy": 2,
  "normal": 3,
  "medium": 5,
  "hard": 8,
};

// Difficulty explanation for tooltip
const DIFFICULTY_INFO = {
  "very easy": {
    effort: "Less than 2 hours",
  },
  "easy": {
    effort: "Half a day",
  },
  "normal": {
    effort: "Up to two days",
  },
  "medium": {
    effort: "Few days",
  },
  "hard": {
    effort: "Around a week",
  },
};

interface DifficultyPointsTooltipProps {
  className?: string;
}

const DifficultyPointsTooltip = ({ 
  className = "h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-help" 
}: DifficultyPointsTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className={className} />
        </TooltipTrigger>
        <TooltipContent className="max-w-2xl p-4 bg-white dark:bg-black-100 border border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Story Points Reference</h4>
            <div className="grid grid-cols-5 gap-3 text-xs">
              {DIFFICULTY_LEVELS.map((level) => (
                <div key={level} className="text-center border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                  <div className="font-medium capitalize text-lg mb-2 text-gray-900 dark:text-white">{level}</div>
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-xl mb-2">
                    {DIFFICULTY_POINTS[level as keyof typeof DIFFICULTY_POINTS]} pts
                  </div>
                  <div className="text-dark-200 dark:text-lightgray">
                    <div><strong>Effort:</strong> {DIFFICULTY_INFO[level as keyof typeof DIFFICULTY_INFO].effort}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DifficultyPointsTooltip;
export { DIFFICULTY_LEVELS, DIFFICULTY_POINTS, DIFFICULTY_INFO };
