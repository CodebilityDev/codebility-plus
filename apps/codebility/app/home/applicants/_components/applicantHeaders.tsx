import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { H1 } from "@/components/shared/dashboard";

import { ExperienceRanges, NewApplicantType } from "../_service/types";
import ApplicantFiltersComponent from "./applicantFilters";
import ApplicantFiltersBadge from "./applicantFiltersBadge";
import ApplicantSorters, { SortOption } from "./applicantSorters";

export type ApplicantFilters = {
  hasPortfolio: boolean;
  noPortfolio: boolean;
  hasGithub: boolean;
  noGithub: boolean;
  experienceRanges: ExperienceRanges;
  positions: Record<string, boolean>;
  techStacks: Record<string, boolean>;
  testStatus: {
    taken: boolean;
    notTaken: boolean;
    overdue: boolean;
  };
  reminderCount: {
    none: boolean;
    low: boolean;
    medium: boolean;
    high: boolean;
  };
  applicationDate: {
    last7Days: boolean;
    last30Days: boolean;
    last90Days: boolean;
    custom: boolean;
    startDate: string;
    endDate: string;
  };
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
  const [sortOptions, setSortOptions] = useState<SortOption[]>([]);

  // Add a new sort option
  const addSort = useCallback((field: string, label: string) => {
    setSortOptions(prev => [...prev, { field, direction: "desc", label }]);
  }, []);

  // Remove a sort option
  const removeSort = useCallback((field: string) => {
    setSortOptions(prev => prev.filter(option => option.field !== field));
  }, []);

  // Toggle sort direction for a specific field
  const toggleSortDirection = useCallback((field: string) => {
    setSortOptions(prev => 
      prev.map(option => 
        option.field === field 
          ? { ...option, direction: option.direction === "asc" ? "desc" : "asc" }
          : option
      )
    );
  }, []);

  // Reorder sort options (for priority)
  const reorderSorts = useCallback((newSortOptions: SortOption[]) => {
    setSortOptions(newSortOptions);
  }, []);

  // Legacy toggle sort function (for backward compatibility)
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
      case "waitlist":
        setCurrentTab("waitlist");
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
    techStacks: {},
    testStatus: {
      taken: false,
      notTaken: false,
      overdue: false,
    },
    reminderCount: {
      none: false,
      low: false,
      medium: false,
      high: false,
    },
    applicationDate: {
      last7Days: false,
      last30Days: false,
      last90Days: false,
      custom: false,
      startDate: "",
      endDate: "",
    },
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

      // Filter by tech stacks
      const techStackFilter = Object.entries(filters.techStacks).find(
        ([techStack, isChecked]) => {
          if (isChecked) {
            return applicant.tech_stacks?.includes(techStack);
          }
          return false;
        },
      );

      if (techStackFilter) {
        return true;
      }
      if (Object.values(filters.techStacks).some((isChecked) => isChecked)) {
        return false;
      }

      // Filter by test status
      if (filters.testStatus.taken && !applicant.applicant?.test_taken) return false;
      if (filters.testStatus.notTaken && applicant.applicant?.test_taken) return false;
      if (filters.testStatus.overdue) {
        // Consider overdue if test not taken and applied more than 7 days ago
        const isOverdue = !applicant.applicant?.test_taken && 
          applicant.date_applied && 
          new Date(applicant.date_applied) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        if (!isOverdue) return false;
      }

      // Filter by reminder count
      const reminderCount = applicant.applicant?.reminded_count || 0;
      if (filters.reminderCount.none && reminderCount !== 0) return false;
      if (filters.reminderCount.low && (reminderCount < 1 || reminderCount > 2)) return false;
      if (filters.reminderCount.medium && (reminderCount < 3 || reminderCount > 5)) return false;
      if (filters.reminderCount.high && reminderCount < 5) return false;

      // Filter by application date
      if (filters.applicationDate.last7Days || filters.applicationDate.last30Days || filters.applicationDate.last90Days) {
        const applicationDate = applicant.date_applied ? new Date(applicant.date_applied) : null;
        if (!applicationDate) return false;

        const now = new Date();
        if (filters.applicationDate.last7Days) {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (applicationDate < sevenDaysAgo) return false;
        }
        if (filters.applicationDate.last30Days) {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (applicationDate < thirtyDaysAgo) return false;
        }
        if (filters.applicationDate.last90Days) {
          const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          if (applicationDate < ninetyDaysAgo) return false;
        }
      }

      return true;
    });

    // Apply sorting
    if (sortOptions.length > 0) {
      filteredApplicants.sort((a, b) => {
        // Apply multiple sorts in priority order
        for (const sortOption of sortOptions) {
          let valueA: any, valueB: any;

          switch (sortOption.field) {
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
            case "dateApplied":
              valueA = a.date_applied ? new Date(a.date_applied).getTime() : 0;
              valueB = b.date_applied ? new Date(b.date_applied).getTime() : 0;
              break;
            case "testTaken":
              valueA = a.applicant?.test_taken ? new Date(a.applicant.test_taken).getTime() : 0;
              valueB = b.applicant?.test_taken ? new Date(b.applicant.test_taken).getTime() : 0;
              break;
            case "reminderCount":
              valueA = a.applicant?.reminded_count || 0;
              valueB = b.applicant?.reminded_count || 0;
              break;
            case "techStackCount":
              valueA = a.tech_stacks?.length || 0;
              valueB = b.tech_stacks?.length || 0;
              break;
            default:
              continue; // Skip unknown fields
          }

          let comparison = 0;
          
          // For numeric values
          if (typeof valueA === "number" && typeof valueB === "number") {
            comparison = sortOption.direction === "asc" ? valueA - valueB : valueB - valueA;
          } else {
            // For string values
            if (valueA < valueB) comparison = sortOption.direction === "asc" ? -1 : 1;
            else if (valueA > valueB) comparison = sortOption.direction === "asc" ? 1 : -1;
          }

          // If this sort criteria produces a difference, return it
          if (comparison !== 0) return comparison;
        }
        
        // If all sort criteria are equal, maintain original order
        return 0;
      });
    } else if (sortField) {
      // Legacy single sort fallback
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
          case "dateApplied":
            valueA = a.date_applied ? new Date(a.date_applied).getTime() : 0;
            valueB = b.date_applied ? new Date(b.date_applied).getTime() : 0;
            break;
          case "testTaken":
            valueA = a.applicant?.test_taken ? new Date(a.applicant.test_taken).getTime() : 0;
            valueB = b.applicant?.test_taken ? new Date(b.applicant.test_taken).getTime() : 0;
            break;
          case "reminderCount":
            valueA = a.applicant?.reminded_count || 0;
            valueB = b.applicant?.reminded_count || 0;
            break;
          case "techStackCount":
            valueA = a.tech_stacks?.length || 0;
            valueB = b.tech_stacks?.length || 0;
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
  }, [filters, sortOptions, sortField, sortDirection, searchTerm, applicants]);

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

    // Count tech stack filters
    for (const tech in filters.techStacks) {
      if (filters.techStacks[tech]) count++;
    }

    // Count test status filters
    if (filters.testStatus.taken) count++;
    if (filters.testStatus.notTaken) count++;
    if (filters.testStatus.overdue) count++;

    // Count reminder filters
    if (filters.reminderCount.none) count++;
    if (filters.reminderCount.low) count++;
    if (filters.reminderCount.medium) count++;
    if (filters.reminderCount.high) count++;

    // Count date filters
    if (filters.applicationDate.last7Days) count++;
    if (filters.applicationDate.last30Days) count++;
    if (filters.applicationDate.last90Days) count++;
    if (filters.applicationDate.custom) count++;

    return count;
  }, [filters]);

  const uniquePositions = useMemo(() => {
    return [
      ...new Set(
        applicants?.map((a) => a.display_position).filter(Boolean) || [],
      ),
    ];
  }, [applicants]);

  const uniqueTechStacks = useMemo(() => {
    const allTechStacks = applicants?.flatMap((a) => a.tech_stacks || []) || [];
    return [...new Set(allTechStacks)].filter(Boolean);
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

  // Update tech stack filter
  const updateTechStackFilter = (techStack: string, value: boolean) => {
    onFilterChange({
      ...filters,
      techStacks: {
        ...filters.techStacks,
        [techStack]: value,
      },
    });
  };

  // Update date range filter
  const updateDateRangeFilter = (key: string, value: boolean | string) => {
    onFilterChange({
      ...filters,
      applicationDate: {
        ...filters.applicationDate,
        [key]: value,
      },
    });
  };

  // Update reminder filter
  const updateReminderFilter = (key: string, value: boolean) => {
    onFilterChange({
      ...filters,
      reminderCount: {
        ...filters.reminderCount,
        [key]: value,
      },
    });
  };

  // Update test status filter
  const updateTestStatusFilter = (key: string, value: boolean) => {
    onFilterChange({
      ...filters,
      testStatus: {
        ...filters.testStatus,
        [key]: value,
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
      techStacks: {},
      testStatus: {
        taken: false,
        notTaken: false,
        overdue: false,
      },
      reminderCount: {
        none: false,
        low: false,
        medium: false,
        high: false,
      },
      applicationDate: {
        last7Days: false,
        last30Days: false,
        last90Days: false,
        custom: false,
        startDate: "",
        endDate: "",
      },
    });
    setApplicants(applicants);
  };

  const resetSort = () => {
    setSortField(null);
    setSortDirection("desc");
    setSortOptions([]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <H1>Applicants Management</H1>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4">
          {/* Mobile: Stack search input on top, buttons below */}
          <div className="flex flex-col gap-3 md:hidden">
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
            />
            <div className="flex items-center justify-center gap-3">
              <ApplicantSorters
                sortOptions={sortOptions}
                onAddSort={addSort}
                onRemoveSort={removeSort}
                onToggleSortDirection={toggleSortDirection}
                onReorderSorts={reorderSorts}
                resetSort={resetSort}
              />
              <ApplicantFiltersComponent
                activeFilterCount={activeFilterCount}
                filters={filters}
                onResetFilters={onResetFilters}
                uniquePositions={uniquePositions}
                uniqueTechStacks={uniqueTechStacks}
                updateExperienceFilter={updateExperienceFilter}
                updateFilter={updateFilter}
                updatePositionFilter={updatePositionFilter}
                updateTechStackFilter={updateTechStackFilter}
                updateDateRangeFilter={updateDateRangeFilter}
                updateReminderFilter={updateReminderFilter}
                updateTestStatusFilter={updateTestStatusFilter}
              />
            </div>
          </div>
          
          {/* Desktop: Inline layout */}
          <div className="hidden items-center justify-end gap-4 md:flex">
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="h-11 w-full max-w-80 rounded-lg border border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-500 focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-customBlue-400 dark:focus:ring-customBlue-400"
            />
            <ApplicantSorters
              sortOptions={sortOptions}
              onAddSort={addSort}
              onRemoveSort={removeSort}
              onToggleSortDirection={toggleSortDirection}
              onReorderSorts={reorderSorts}
              resetSort={resetSort}
            />
            <ApplicantFiltersComponent
              activeFilterCount={activeFilterCount}
              filters={filters}
              onResetFilters={onResetFilters}
              uniquePositions={uniquePositions}
              uniqueTechStacks={uniqueTechStacks}
              updateExperienceFilter={updateExperienceFilter}
              updateFilter={updateFilter}
              updatePositionFilter={updatePositionFilter}
              updateTechStackFilter={updateTechStackFilter}
              updateDateRangeFilter={updateDateRangeFilter}
              updateReminderFilter={updateReminderFilter}
              updateTestStatusFilter={updateTestStatusFilter}
            />
          </div>
        </div>
      </div>

      {/* Filter badges */}
      <ApplicantFiltersBadge
        filters={filters}
        setFilter={setFilters}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}

memo(ApplicantFilterHeaders);
