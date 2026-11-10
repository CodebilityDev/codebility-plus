"use client";

import type { JobListing } from "@/types/global/job-listings";
import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

const CareersContext = createContext<{
  selectedJob: JobListing | null;
  selectJob: (job: JobListing) => void;
} | null>(null);

export function CareersProvider({ children }: { children: ReactNode }) {
  const [selectedJob, selectJob] = useState<JobListing | null>(null);
  return (
    <CareersContext.Provider value={{ selectedJob, selectJob }}>
      {children}
    </CareersContext.Provider>
  );
}

export function useCareers() {
  const context = useContext(CareersContext);
  if (!context) throw new Error("CareersProvider is required");
  return context;
}
