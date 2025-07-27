"use client";

import { useState } from "react";
import H1 from "@/components/shared/dashboard/H1";
import { Codev } from "@/types/home/codev";

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

  return (
    <div className="flex flex-col gap-12">
      {/* Header Section */}
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-5xl font-light tracking-tight text-gray-900 dark:text-white">
            Our Developers
          </h1>
          <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        </div>
        <p className="mx-auto max-w-2xl text-lg font-light text-gray-600 dark:text-gray-300">
          Meet our talented team of developers ready to bring your ideas to life
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="order-2 md:order-1">
          <FilterCodevs filters={filters} setFilters={setFilters} />
        </div>
        <div className="order-1 w-full max-w-md md:order-2">
          <CodevSearchbar
            allCodevs={data}
            codevs={codevs}
            setCodevs={setCodevs}
          />
        </div>
      </div>

      {/* Content Section */}
      <CodevList filters={filters} data={codevs} />
    </div>
  );
}
