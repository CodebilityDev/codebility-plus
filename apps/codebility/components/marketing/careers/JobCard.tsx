"use client";

import { Button } from "@/components/global/ui/button";
import type { JobListing } from "@/types/global/job-listings";
import { getLevelColor, getTypeColor } from "@/utils/marketing/careers/careers";
import { Badge } from "@codevs/ui/badge";
import { Briefcase, MapPin, DollarSign } from "lucide-react";

export function JobCard({
  job,
  onApply,
}: {
  job: JobListing;
  onApply: (job: JobListing) => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm transition-all hover:border-customViolet-100/50 hover:bg-gray-900/70">
      <div className="absolute inset-0 bg-gradient-to-r from-customViolet-100/5 to-customBlue-100/5 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{job.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.department}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary_range && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary_range}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="purple"
              size="sm"
              className="h-8 w-full max-w-[80px] px-3 text-xs sm:mt-0 sm:w-auto"
              onClick={() => onApply(job)}
            >
              Apply
            </Button>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-300">
          {job.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={getLevelColor(job.level)}>
            {job.level}
          </Badge>
          <Badge variant="outline" className={getTypeColor(job.type)}>
            {job.type}
          </Badge>
          {job.remote && (
            <Badge
              variant="outline"
              className="border-green-500/20 bg-green-500/10 text-green-400"
            >
              Remote
            </Badge>
          )}
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">
            Posted {new Date(job.posted_date).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-4 border-t border-gray-800 pt-4">
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, index) => (
              <span
                key={index}
                className="rounded-full bg-gray-800/50 px-2.5 py-1 text-xs text-gray-400"
              >
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
