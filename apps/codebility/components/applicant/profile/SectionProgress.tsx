"use client";

import { ProgressBar } from "@/components/applicant/profile/ProgressBar";

// Section Progress Component
export const SectionProgress = ({ 
  title, 
  points, 
  maxPoints, 
  icon: Icon,
  completed 
}: { 
  title: string; 
  points: number; 
  maxPoints: number; 
  icon: any;
  completed: boolean;
}) => {
  const percentage = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700">
      <div className={`p-2 rounded-lg ${completed ? 'bg-green-500/20' : 'bg-gray-700/50'}`}>
        <Icon className={`w-4 h-4 ${completed ? 'text-green-400' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-200">{title}</span>
          <span className="text-xs text-gray-400">{points}/{maxPoints} pts</span>
        </div>
        <ProgressBar percentage={percentage} showLabel={false} size="small" />
      </div>
    </div>
  );
};
