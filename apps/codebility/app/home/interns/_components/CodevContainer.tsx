"use client";

import { useState } from "react";
import H1 from "../components/shared/dashboard/H1";
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
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <H1>Codevs</H1>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex items-center justify-center gap-4 md:justify-end">
            <CodevSearchbar
              allCodevs={data}
              codevs={codevs}
              setCodevs={setCodevs}
            />
            <FilterCodevs filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>
      <CodevList filters={filters} data={codevs} />
    </div>
  );
}
