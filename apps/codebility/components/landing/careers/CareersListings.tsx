"use client";

import type { JobListing } from "@/types/global/job-listings";
import { useState } from "react";
import { Chip } from "@/components/global/design-system/Chip";
import { JobListingRow } from "@/components/global/design-system/JobListingRow";
import { useCareers } from "@/providers/landing/careers/CareersProvider";
import {
  Blocks,
  FileText,
  Globe2,
  Monitor,
  Rocket,
  Smartphone,
  Sparkles,
  Users,
} from "lucide-react";

const filters = [
  "All roles",
  "Engineering",
  "Operations",
  "Full-time",
  "Part-time",
  "Mid",
  "Senior",
];
const icons = [
  Monitor,
  Blocks,
  Users,
  Sparkles,
  Blocks,
  Rocket,
  FileText,
  Smartphone,
];

export function CareersListings({
  jobs,
  failed = false,
  initialSearch = "",
  initialFilter = "",
  initialLocation = "",
}: {
  jobs: JobListing[] | null;
  failed?: boolean;
  initialSearch?: string;
  initialFilter?: string;
  initialLocation?: string;
}) {
  const { selectedJob, selectJob } = useCareers();
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);
  const shown = (jobs ?? []).filter((job) => {
    const content =
      `${job.title} ${job.description} ${job.department} ${job.requirements.join(" ")}`.toLowerCase();
    const matchesFilter =
      !filter ||
      (filter === "Engineering"
        ? /engineering/i.test(job.department) ||
          (/developer|engineer|architect/i.test(job.title) &&
            !/admin|assistant|operations/i.test(job.title))
        : filter === "Operations"
          ? /operations/i.test(job.department) ||
            /admin|assistant|operations/i.test(job.title)
          : filter === "AI & Automation"
            ? /\bAI\b|automation|n8n/i.test(job.title)
            : filter === "Mobile"
              ? /mobile/i.test(job.title)
              : job.type === filter ||
                job.level === filter ||
                job.department.toLowerCase() === filter.toLowerCase());
    return (
      matchesFilter &&
      content.includes(search.toLowerCase()) &&
      (!location ||
        (location === "remote"
          ? job.remote
          : job.location.toLowerCase().includes(location.toLowerCase())))
    );
  });

  return (
    <div>
      <div className="careers-filter-bar" aria-label="Filter open roles">
        {filters.map((item) => (
          <Chip
            key={item}
            size="sm"
            selected={
              jobs !== null &&
              (item === "All roles" ? !filter : filter === item)
            }
            onClick={() => setFilter(item === "All roles" ? "" : item)}
          >
            {item}
          </Chip>
        ))}
        <span className="careers-count" aria-live="polite">
          {jobs === null ? "Loading roles…" : `${shown.length} roles`}
        </span>
      </div>
      {(search || location || (filter && !filters.includes(filter))) && (
        <div className="careers-active-filters">
          <span>
            Showing {filter || "all roles"}
            {search && ` matching “${search}”`}
            {location && ` · ${location}`}
          </span>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFilter("");
              setLocation("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <div className="careers-job-list" aria-busy={jobs === null}>
        {jobs === null
          ? Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="careers-job-skeleton animate-pulse">
                <div />
                <div />
                <div />
              </div>
            ))
          : shown.map((job, index) => {
              const Icon = icons[index % icons.length] ?? Monitor;
              const active = selectedJob
                ? selectedJob.id === job.id
                : /AI Engineer/i.test(job.title);
              return (
                <JobListingRow
                  key={job.id}
                  href="#apply"
                  title={job.title}
                  description={
                    job.description.replace(/<[^>]*>/g, "").split("\n")[0] ?? ""
                  }
                  icon={<Icon />}
                  tags={[
                    { label: job.level, highlighted: true },
                    {
                      label: /volunteer/i.test(job.title)
                        ? "Volunteer"
                        : job.type,
                    },
                    {
                      label: job.remote ? "Remote" : job.location,
                      icon: <Globe2 />,
                    },
                  ]}
                  postedAt={new Date(job.posted_date).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      timeZone: "UTC",
                    },
                  )}
                  active={active}
                  className={[
                    "careers-job",
                    active && "careers-job-selected",
                    /volunteer/i.test(job.title) && "careers-job-volunteer",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => selectJob(job)}
                  ariaLabel={"Apply for " + job.title}
                />
              );
            })}
        {jobs !== null && !shown.length && (
          <div className="careers-empty" role="status">
            <h3>
              {failed ? "We couldn’t load the open roles." : "No roles found."}
            </h3>
            <p>
              {failed
                ? "Please refresh the page to try again."
                : "Try another filter or check back soon for new opportunities."}
            </p>
            {failed && (
              <button type="button" onClick={() => window.location.reload()}>
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
