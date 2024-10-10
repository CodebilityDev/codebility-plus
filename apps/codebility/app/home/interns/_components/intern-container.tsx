"use client"
import { useState } from "react";


import H1 from "@/Components/shared/dashboard/H1";
import { User } from "@/types";

import InternList from "./intern-list";
import FilterInterns from "./interns-filter";

export default function InternContainer({ data }: { data: User[] }) {
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <H1>Interns</H1>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex justify-center md:justify-end">
            <FilterInterns filters={filters} setFilters={setFilters} />
          </div>
        </div>
      </div>
      <InternList filters={filters} data={data} />
    </div>
  );
}