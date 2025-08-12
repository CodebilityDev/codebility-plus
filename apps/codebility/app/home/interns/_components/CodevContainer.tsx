"use client";

import { useState } from "react";
import H1 from "@/components/shared/dashboard/H1";
import { Codev } from "@/types/home/codev";

import { getMemberStats } from "../../in-house/_lib/utils";
import CodevList from "./CodevList";
import CodevSearchbar from "./CodevSearchbar";
import FilterCodevs from "./FilterCodevs";

export default function CodevContainer({ data }: { data: Codev[] }) {
  const [filters, setFilters] = useState({
    positions: [] as string[],
    projects: [] as string[],
    availability: [] as string[],
  });

  const [codevs, setCodevs] = useState<Codev[]>(data);
  const stats = getMemberStats(codevs);
  return (
    <div className="flex flex-col gap-12">
      {/* Header Section */}
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
            Our Developers
          </h1>
          <div className="via-customBlue-400 mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent to-transparent"></div>
        </div>
        <p className="mx-auto max-w-2xl text-lg font-light text-gray-600 dark:text-gray-300">
          Meet our talented team of developers ready to bring your ideas to life
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Stats - Left */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
          <span className="bg-customBlue-500 rounded-full px-2.5 py-1 text-white shadow-sm sm:px-3 sm:py-1.5">
            {stats.total} {stats.total === 1 ? "member" : "members"}
          </span>
          <span className="rounded-full bg-emerald-600 px-2.5 py-1 text-white shadow-sm sm:px-3 sm:py-1.5">
            {stats.active} active
          </span>
          <span className="rounded-full bg-red-500 px-2.5 py-1 text-white shadow-sm sm:px-3 sm:py-1.5">
            {stats.inactive} inactive
          </span>
        </div>

        {/* Search + Filters - Right */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-end">
          <div className="w-full max-w-md">
            <CodevSearchbar
              allCodevs={data}
              codevs={codevs}
              setCodevs={setCodevs}
            />
          </div>
          <div>
            <FilterCodevs filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <CodevList filters={filters} data={codevs} />
    </div>
  );
}
