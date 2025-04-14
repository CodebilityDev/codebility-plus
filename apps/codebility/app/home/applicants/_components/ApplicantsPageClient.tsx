"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import ApplicantsFilterBadges from "@/app/home/applicants/_components/ApplicantsFilterBadges";
import ApplicantsFilteringHeader from "@/app/home/applicants/_components/ApplicantsFilteringHeader";
import ApplicantsTabs from "@/app/home/applicants/_components/ApplicantsTabs";
import { fetchApplicants } from "@/app/home/applicants/action";
import ApplicantsLoading from "@/app/home/applicants/loading";
import { Box, H1 } from "@/Components/shared/dashboard";
import { Codev } from "@/types/home/codev";
import { Toaster } from "react-hot-toast";

const ApplicantsList = dynamic(
  () => import("@/app/home/applicants/_components/ApplicantsList"),
  { loading: () => <ApplicantsLoading /> },
);

// Define filter types
export type ExperienceRanges = {
  novice: boolean; // 0-2 years
  intermediate: boolean; // 3-5 years
  expert: boolean; // 5+ years
};

export type Filters = {
  hasPortfolio: boolean;
  noPortfolio: boolean;
  hasGithub: boolean;
  noGithub: boolean;
  assessmentSent: boolean;
  assessmentNotSent: boolean;
  experienceRanges: ExperienceRanges;
  positions: Record<string, boolean>;
};

export type ApplicantStatus =
  | "applying" // Initial application
  | "testing" // Taking assessment test
  | "onboarding" // Passed assessment, in interview/onboarding process
  | "denied" // Application denied
  | "passed" // Final acceptance (becomes CODEV)
  | "rejected"; // Rejected (counts in rejected_count)

const ApplicantsPageClient = () => {
  // Data loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicants, setApplicants] = useState<Codev[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ApplicantStatus>("applying");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Filtering and sorting state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredApplicants, setFilteredApplicants] = useState<Codev[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<Filters>({
    hasPortfolio: false,
    noPortfolio: false,
    hasGithub: false,
    noGithub: false,
    assessmentSent: false,
    assessmentNotSent: false,
    experienceRanges: {
      novice: false,
      intermediate: false,
      expert: false,
    },
    positions: {},
  });

  // Assessment tracking state
  const [sentAssessments, setSentAssessments] = useState<
    Record<string, boolean>
  >({});

  // Extract unique positions for filtering
  const uniquePositions = useMemo(() => {
    return [
      ...new Set(
        applicants?.map((a) => a.display_position).filter(Boolean) || [],
      ),
    ];
  }, [applicants]);

  // Group applicants by their status
  const applicantsByStatus = useMemo(() => {
    const grouped: Record<ApplicantStatus, Codev[]> = {
      applying: [],
      testing: [],
      onboarding: [],
      denied: [],
      passed: [],
      rejected: [],
    };

    applicants.forEach((applicant) => {
      const status =
        (applicant.application_status as ApplicantStatus) || "applying";
      if (grouped[status]) {
        grouped[status].push(applicant);
      } else {
        grouped.applying.push(applicant);
      }
    });

    return grouped;
  }, [applicants]);

  // Get counts for each tab
  const tabCounts = useMemo(() => {
    return {
      applying: applicantsByStatus.applying?.length || 0,
      testing: applicantsByStatus.testing?.length || 0,
      onboarding: applicantsByStatus.onboarding?.length || 0,
      denied: applicantsByStatus.denied?.length || 0,
      passed: applicantsByStatus.passed?.length || 0,
      rejected: applicantsByStatus.rejected?.length || 0,
    };
  }, [applicantsByStatus]);

  // Function to refresh data
  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Load applicants data
  useEffect(() => {
    const getApplicants = async () => {
      setIsLoading(true);
      try {
        const { applicants: fetchedApplicants, error: fetchError } =
          await fetchApplicants();

        if (fetchError) {
          setError(fetchError);
        } else {
          setApplicants(fetchedApplicants);
        }
      } catch (err) {
        setError("Unable to fetch applicants");
      } finally {
        setIsLoading(false);
      }
    };

    getApplicants();
  }, [refreshTrigger]); // Add refreshTrigger to dependency array

  // Load saved assessment data
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sentAssessments");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure the parsed data is correctly typed
        if (typeof parsed === "object" && parsed !== null) {
          // Explicitly cast the parsed data to the correct type
          const typedData: Record<string, boolean> = {};

          // Validate each entry to ensure it's a boolean
          Object.entries(parsed).forEach(([key, value]) => {
            if (typeof value === "boolean") {
              typedData[key] = value;
            }
          });

          setSentAssessments(typedData);
        }
      }
    } catch (error) {
      console.error("Error loading sent assessments:", error);
    }
  }, []);

  // Initialize position filters
  useEffect(() => {
    // Only run once when positions are available
    if (
      uniquePositions.length > 0 &&
      Object.keys(filters.positions).length === 0
    ) {
      const posObj = uniquePositions.reduce(
        (acc, pos) => {
          if (pos) acc[pos] = false;
          return acc;
        },
        {} as Record<string, boolean>,
      );

      setFilters((prev) => ({
        ...prev,
        positions: posObj,
      }));
    }
  }, [uniquePositions, filters.positions]);

  // Track when assessment is sent
  const trackAssessmentSent = useCallback(
    (applicantId: string) => {
      const newSentAssessments = {
        ...sentAssessments,
        [applicantId]: true,
      };

      setSentAssessments(newSentAssessments);

      // Save to localStorage
      try {
        localStorage.setItem(
          "sentAssessments",
          JSON.stringify(newSentAssessments),
        );
      } catch (error) {
        console.error("Error saving sent assessments:", error);
      }

      // Refresh data to reflect status changes
      refreshData();
    },
    [sentAssessments, refreshData],
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({
      hasPortfolio: false,
      noPortfolio: false,
      hasGithub: false,
      noGithub: false,
      assessmentSent: false,
      assessmentNotSent: false,
      experienceRanges: {
        novice: false,
        intermediate: false,
        expert: false,
      },
      positions: Object.keys(filters.positions).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {} as Record<string, boolean>,
      ),
    });
    setSortField(null);
    setSearchTerm("");
  }, [filters.positions]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;

    // Count basic filters
    if (filters.hasPortfolio) count++;
    if (filters.noPortfolio) count++;
    if (filters.hasGithub) count++;
    if (filters.noGithub) count++;
    if (filters.assessmentSent) count++;
    if (filters.assessmentNotSent) count++;

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

  // Apply filters and sorting
  useEffect(() => {
    if (
      !applicantsByStatus[activeTab] ||
      applicantsByStatus[activeTab].length === 0
    ) {
      setFilteredApplicants([]);
      return;
    }

    // Start with the correct tab's applicants
    let results = [...applicantsByStatus[activeTab]];

    // Filter applicants
    // Search term filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter((app) => {
        const fullName =
          `${app.first_name || ""} ${app.last_name || ""}`.toLowerCase();
        const email = app.email_address?.toLowerCase() || "";
        const portfolio = app.portfolio_website?.toLowerCase() || "";
        const github = app.github?.toLowerCase() || "";
        const position = app.display_position?.toLowerCase() || "";

        return (
          fullName.includes(search) ||
          email.includes(search) ||
          portfolio.includes(search) ||
          github.includes(search) ||
          position.includes(search)
        );
      });
    }

    // Portfolio filters
    if (filters.hasPortfolio) {
      results = results.filter((a) => !!a.portfolio_website);
    }
    if (filters.noPortfolio) {
      results = results.filter((a) => !a.portfolio_website);
    }

    // GitHub filters
    if (filters.hasGithub) {
      results = results.filter((a) => !!a.github);
    }
    if (filters.noGithub) {
      results = results.filter((a) => !a.github);
    }

    // Assessment filters
    if (filters.assessmentSent) {
      results = results.filter((a) => !!sentAssessments[a.id]);
    }
    if (filters.assessmentNotSent) {
      results = results.filter((a) => !sentAssessments[a.id]);
    }

    // Experience filters
    const expFiltersActive = Object.values(filters.experienceRanges).some(
      Boolean,
    );
    if (expFiltersActive) {
      results = results.filter((a) => {
        const years = a.years_of_experience || 0;

        if (filters.experienceRanges.novice && years >= 0 && years <= 2)
          return true;
        if (filters.experienceRanges.intermediate && years >= 3 && years <= 5)
          return true;
        if (filters.experienceRanges.expert && years > 5) return true;

        return false;
      });
    }

    // Position filters
    const posFiltersActive = Object.values(filters.positions).some(Boolean);
    if (posFiltersActive && filters.positions) {
      results = results.filter((a) => {
        if (!a.display_position) return false;
        return !!filters.positions[a.display_position];
      });
    }

    // Apply sorting
    if (sortField) {
      results.sort((a, b) => {
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

    setFilteredApplicants(results);
  }, [
    applicantsByStatus,
    activeTab,
    searchTerm,
    filters,
    sortField,
    sortDirection,
    sentAssessments,
  ]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((value: ApplicantStatus) => {
    setActiveTab(value);
    // Reset some filters when changing tabs
    setSearchTerm("");
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  // Handle status change
  const handleStatusChange = useCallback(() => {
    // Refresh data when status changes
    refreshData();
  }, [refreshData]);

  if (isLoading) return <ApplicantsLoading />;
  if (error) return <div className="text-red-500">ERROR: {error}</div>;

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <H1>Applicants Management</H1>
          </div>

          {/* Filtering header component */}
          <ApplicantsFilteringHeader
            applicants={applicants}
            searchTerm={searchTerm}
            filters={filters}
            sortField={sortField}
            sortDirection={sortDirection}
            activeFilterCount={activeFilterCount}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onToggleSort={toggleSort}
            onResetFilters={resetFilters}
            uniquePositions={uniquePositions}
          />
        </div>

        {/* Filter badges summary */}
        {activeFilterCount > 0 && (
          <ApplicantsFilterBadges
            filters={filters}
            sortField={sortField}
            sortDirection={sortDirection}
            onFilterChange={handleFilterChange}
            onToggleSort={toggleSort}
            setSortField={setSortField}
          />
        )}

        {/* Tabs for applicant stages */}
        <ApplicantsTabs
          activeTab={activeTab}
          tabCounts={tabCounts}
          onTabChange={handleTabChange}
        >
          {/* Tab content */}
          <Box>
            {filteredApplicants.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                No applicants found matching your criteria.
              </div>
            ) : (
              <ApplicantsList
                applicants={filteredApplicants}
                trackAssessmentSent={trackAssessmentSent}
                sentAssessments={sentAssessments}
                activeTab={activeTab}
                onStatusChange={handleStatusChange}
              />
            )}
          </Box>
        </ApplicantsTabs>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ApplicantsPageClient;
