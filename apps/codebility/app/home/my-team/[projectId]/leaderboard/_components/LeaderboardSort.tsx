"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";

interface LeaderboardSortProps {
  currentRange: string;
}

const rangeLabels: Record<string, string> = {
  "this-week": "This Week",
  "last-week": "Last Week",
  "this-month": "This Month",
  "last-month": "Last Month"
};

export default function LeaderboardSort({ currentRange }: LeaderboardSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="hidden md:block text-xs font-black uppercase tracking-widest text-gray-400">Sort By Period:</span>
      <Select value={currentRange} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-gray-200 dark:border-gray-800 rounded-xl font-bold text-sm h-11 focus:ring-offset-0 focus:ring-customBlue-500/50 text-gray-900 dark:text-white">
          <div className="flex items-center gap-2">
            <ListFilter className="h-4 w-4 text-customBlue-500" />
            <SelectValue placeholder="Sort Period" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-1">
          {Object.entries(rangeLabels).map(([value, label]) => (
            <SelectItem 
              key={value} 
              value={value}
              className="rounded-xl font-bold text-sm focus:bg-customBlue-50 dark:focus:bg-customBlue-950/30 focus:text-customBlue-600 dark:focus:text-customBlue-400 transition-colors py-2.5"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
