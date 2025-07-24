import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { H1 } from "../components/shared/dashboard";

import { ExperienceRanges, NewApplicantType } from "../_service/types";
import ApplicantFilters from "./applicantFilters";
import ApplicantFiltersComponent from "./applicantFilters";
import ApplicantFiltersBadge from "./applicantFiltersBadge";
import ApplicantSorters from "./applicantSorters";

export type ApplicantFilters = {
  hasPortfolio: boolean;
  noPortfolio: boolean;
  hasGithub: boolean;
  noGithub: boolean;
  experienceRanges: ExperienceRanges;
  positions: Record<string, boolean>;
};

export default function ApplicantFilterHeaders({
  applicants,
  setApplicants,
  setCurrentTab,
}: {
  applicants: NewApplicantType[];
  setApplicants: React.Dispatch<React.SetStateAction<NewApplicantType[]>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const onSearch = (value: string) => {
    setSearchTerm(value);

    const filteredApplicants = applicants.filter((applicant) => {
      const fullName = `${applicant.first_name} ${applicant.last_name}`;
      const email = applicant.email_address;

      return (
        fullName.toLowerCase().includes(value.toLowerCase()) ||
        email.toLowerCase().includes(value.toLowerCase())
      );
    });
    setApplicants(filteredApplicants);
    moveTab(filteredApplicants[0]?.application_status || "applying");
  };

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Toggle sort
  const toggleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField],
  );

  const moveTab = (status: string) => {
    switch (status) {
      case "applying":
        setCurrentTab("applying");
        break;
      case "testing":
        setCurrentTab("testing");
        break;
      case "onboarding":
        setCurrentTab("onboarding");
        break;
      case "denied":
        setCurrentTab("denied");
        break;
      default:
        setCurrentTab("applying");
        break;
    }
  };

  // Update a specific filter // Update a specific filter
  const [filters, setFilters] = useState<ApplicantFilters>({
    hasPortfolio: false,
    noPortfolio: false,
    hasGithub: false,
    noGithub: false,
    experienceRanges: {
      novice: false,
      intermediate: false,
      expert: false,
    },
    positions: {},
  });

  useEffect(() => {
    const filteredApplicants = applicants.filter((applicant) => {
      if (searchTerm) {
        const fullName = `${applicant.first_name} ${applicant.last_name}`;
        const email = applicant.email_address;

        if (
          !fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !email.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
      }

      // Filter by portfolio
      if (filters.hasPortfolio && !applicant.portfolio_website) return false;
      if (filters.noPortfolio && applicant.portfolio_website) return false;

      // Filter by GitHub
      if (filters.hasGithub && !applicant.github) return false;
      if (filters.noGithub && applicant.github) return false;

      // Filter by experience
      if (filters.experienceRanges.novice && applicant.years_of_experience > 2)
        return false;
      if (
        filters.experienceRanges.intermediate &&
        (applicant.years_of_experience < 3 || applicant.years_of_experience > 5)
      )
        return false;
      if (filters.experienceRanges.expert && applicant.years_of_experience < 5)
        return false;

      // Filter by position
      const positionFilter = Object.entries(filters.positions).find(
        ([position, isChecked]) => {
          if (isChecked) {
            return applicant.display_position === position;
          }
          return false;
        },
      );

      if (positionFilter) {
        return true;
      }
      if (Object.values(filters.positions).some((isChecked) => isChecked)) {
        return false;
      }
      return true;
    });

    // Apply sorting
    if (sortField) {
      filteredApplicants.sort((a, b) => {
        let valueA: any, valueB: any;

        switch (sortField) {
          case "name":
            valueA = `${a.first_name || ""} ${a.last_name || ""}`.toLowerCase();
            valueB = `${b.first_name || ""} ${b.last_name || ""}`.toLowerCase();
            break;
          case "position":
            valueA = (a.display_position || "").toLowerCase();
            valueB = (b.display_position || "").toLowerCase();
            break;
          case "experience":
            valueA = a.years_of_experience || 0;
            valueB = b.years_of_experience || 0;
            break;
          default:
            return 0;
        }

        // For numeric values
        if (typeof valueA === "number" && typeof valueB === "number") {
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }

        // For string values
        if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
        if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    // Update the applicants state with the filtered and sorted applicants
    if (searchTerm.length > 0) {
      moveTab(filteredApplicants[0]?.application_status || "applying");
    }

    setApplicants(filteredApplicants);
  }, [filters, sortField, sortDirection, searchTerm, applicants]);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Count basic filters
    if (filters.hasPortfolio) count++;
    if (filters.noPortfolio) count++;
    if (filters.hasGithub) count++;
    if (filters.noGithub) count++;

    // Count experience filters
    if (filters.experienceRanges.novice) count++;
    if (filters.experienceRanges.intermediate) count++;
    if (filters.experienceRanges.expert) count++;

    // Count position filters
    for (const pos in filters.positions) {
      if (filters.positions[pos]) count++;
    }

    return count;
  }, [filters]);

  const uniquePositions = useMemo(() => {
    return [
      ...new Set(
        applicants?.map((a) => a.display_position).filter(Boolean) || [],
      ),
    ];
  }, [applicants]);

  const onFilterChange = (newFilters: ApplicantFilters) => {
    setFilters(newFilters);
  };

  const updateFilter = (key: keyof ApplicantFilters, value: boolean) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  // Update experience filter
  const updateExperienceFilter = (
    key: keyof ExperienceRanges,
    value: boolean,
  ) => {
    onFilterChange({
      ...filters,
      experienceRanges: {
        ...filters.experienceRanges,
        [key]: value,
      },
    });
  };

  // Update position filter
  const updatePositionFilter = (position: string, value: boolean) => {
    onFilterChange({
      ...filters,
      positions: {
        ...filters.positions,
        [position]: value,
      },
    });
  };

  const onResetFilters = () => {
    setFilters({
      hasPortfolio: false,
      noPortfolio: false,
      hasGithub: false,
      noGithub: false,
      experienceRanges: {
        novice: false,
        intermediate: false,
        expert: false,
      },
      positions: {},
    });
    setApplicants(applicants);
  };

  const resetSort = () => {
    setSortField(null);
    setSortDirection("desc");
  };

  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <H1>Applicants Management</H1>
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <div className="flex w-full items-center gap-2">
            {/* Sort Dropdown */}
            <ApplicantSorters
              sortField={sortField}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
              resetSort={resetSort}
            />

            {/* Filter Dropdown */}
            <ApplicantFiltersComponent
              activeFilterCount={activeFilterCount}
              filters={filters}
              onResetFilters={onResetFilters}
              uniquePositions={uniquePositions}
              updateExperienceFilter={updateExperienceFilter}
              updateFilter={updateFilter}
              updatePositionFilter={updatePositionFilter}
            />
          </div>

          {/* search bar */}
          <input
            type="text"
            placeholder="Search applicants"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="border-gray h-10 w-full rounded-full border border-opacity-50 bg-inherit px-5 text-black focus:outline-none dark:text-white md:w-80"
          />
        </div>
      </div>

      <ApplicantFiltersBadge
        filters={filters}
        setFilter={setFilters}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

memo(ApplicantFilterHeaders);
