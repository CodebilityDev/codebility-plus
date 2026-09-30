import React, { memo, useCallback, useMemo, useState } from "react";
import H1 from "@/components/global/layout/H1";

import type { ExperienceRanges } from "@/types/home/applicants/applicants";
import ApplicantFiltersComponent from "@/components/home/applicants/applicantFilters";
import ApplicantFiltersBadge from "@/components/home/applicants/applicantFiltersBadge";
import ApplicantSorters from "@/components/home/applicants/applicantSorters";
import type { SortOption } from "@/types/home/applicants/applicants";
import type { ApplicantFilters } from "@/types/home/applicants/applicants";
import type { ApplicantFilterHeadersProps } from "@/types/home/applicants/applicants";

function ApplicantFilterHeaders({
  applicants,
  setApplicants,
  setCurrentTab,
}: ApplicantFilterHeadersProps) {
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
    moveTab(filteredApplicants[0]?.application_status ?? "applying");
  };

  const [, setSortField] = useState<string | null>(null);
  const [, setSortDirection] = useState<"asc" | "desc">("desc");
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
        applicants.map((a) => a.display_position).filter(Boolean),
      ),
    ];
  }, [applicants]);

  const uniqueTechStacks = useMemo(() => {
    const allTechStacks = applicants.flatMap((a) => a.tech_stacks);
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

export default memo(ApplicantFilterHeaders);