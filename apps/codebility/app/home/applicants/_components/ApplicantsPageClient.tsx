"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { fetchApplicants } from "@/app/home/applicants/action";
import ApplicantsLoading from "@/app/home/applicants/loading";
import { Box, H1 } from "@/Components/shared/dashboard";
import Search from "@/Components/shared/dashboard/Search";
import { Button } from "@/Components/ui/button";
import { Codev } from "@/types/home/codev";
import { ChevronDown, Filter, SortDesc, X } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { Badge } from "@codevs/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@codevs/ui/dropdown-menu";

const ApplicantsList = dynamic(
  () => import("@/app/home/applicants/_components/ApplicantsList"),
  { loading: () => <ApplicantsLoading /> },
);

// Define filter types
type ExperienceRanges = {
  novice: boolean; // 0-2 years
  intermediate: boolean; // 3-5 years
  expert: boolean; // 5+ years
};

type Filters = {
  hasPortfolio: boolean;
  noPortfolio: boolean;
  hasGithub: boolean;
  noGithub: boolean;
  assessmentSent: boolean;
  assessmentNotSent: boolean;
  experienceRanges: ExperienceRanges;
  positions: Record<string, boolean>;
};

const ApplicantsPageClient = () => {
  // Data loading state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applicants, setApplicants] = useState<Codev[]>([]);
  const [error, setError] = useState<string | null>(null);

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
          setFilteredApplicants(fetchedApplicants);
        }
      } catch (err) {
        setError("Unable to fetch applicants");
      } finally {
        setIsLoading(false);
      }
    };

    getApplicants();
  }, []);

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
    },
    [sentAssessments],
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
    if (!applicants || applicants.length === 0) {
      setFilteredApplicants([]);
      return;
    }

    // Filter applicants
    let results = [...applicants];

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
    applicants,
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

  if (isLoading) return <ApplicantsLoading />;
  if (error) return <div className="text-red-500">ERROR: {error}</div>;

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <H1>Applicants List</H1>
            {applicants?.length > 0 && (
              <Badge className="bg-light-800 text-black-500 dark:bg-dark-300 dark:text-light-800">
                {applicants.length}
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex gap-2">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:bg-dark-200 dark:border-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1 border-gray-300 bg-white"
                  >
                    <SortDesc className="h-4 w-4" />
                    <span>Sort</span>
                    {sortField && <ChevronDown className="ml-1 h-3 w-3" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-dark-200 dark:border-dark-400 min-w-[140px] border border-gray-300 bg-white">
                  <DropdownMenuLabel className="text-black-500 dark:text-light-800">
                    Sort by
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                  <DropdownMenuItem
                    className={`flex justify-between ${sortField === "name" ? "text-blue-500 dark:text-blue-300" : "text-black-500 dark:text-light-800"}`}
                    onClick={() => toggleSort("name")}
                  >
                    Name
                    {sortField === "name" && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`flex justify-between ${sortField === "position" ? "text-blue-500 dark:text-blue-300" : "text-black-500 dark:text-light-800"}`}
                    onClick={() => toggleSort("position")}
                  >
                    Position
                    {sortField === "position" && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={`flex justify-between ${sortField === "experience" ? "text-blue-500 dark:text-blue-300" : "text-black-500 dark:text-light-800"}`}
                    onClick={() => toggleSort("experience")}
                  >
                    Experience
                    {sortField === "experience" && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="dark:bg-dark-200 dark:border-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1 border-gray-300 bg-white"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                      <Badge className="ml-1 flex h-5 w-5 items-center justify-center bg-blue-500 p-0 text-white">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-dark-200 dark:border-dark-400 border border-gray-300 bg-white">
                  <DropdownMenuLabel className="text-black-500 dark:text-light-800">
                    Filter applicants
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />

                  <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                    Portfolio
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.hasPortfolio}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        hasPortfolio: !!checked,
                      }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    Has portfolio
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.noPortfolio}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        noPortfolio: !!checked,
                      }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    No portfolio
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                  <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                    GitHub
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.hasGithub}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({ ...prev, hasGithub: !!checked }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    Has GitHub
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.noGithub}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({ ...prev, noGithub: !!checked }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    No GitHub
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                  <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                    Assessment
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.assessmentSent}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        assessmentSent: !!checked,
                      }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    Assessment sent
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.assessmentNotSent}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        assessmentNotSent: !!checked,
                      }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    Assessment not sent
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                  <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                    Experience
                  </DropdownMenuLabel>
                  <DropdownMenuCheckboxItem
                    checked={filters.experienceRanges.novice}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        experienceRanges: {
                          ...prev.experienceRanges,
                          novice: !!checked,
                        },
                      }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    0-2 years
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.experienceRanges.intermediate}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        experienceRanges: {
                          ...prev.experienceRanges,
                          intermediate: !!checked,
                        },
                      }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    3-5 years
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={filters.experienceRanges.expert}
                    onCheckedChange={(checked) =>
                      setFilters((prev) => ({
                        ...prev,
                        experienceRanges: {
                          ...prev.experienceRanges,
                          expert: !!checked,
                        },
                      }))
                    }
                    className="text-black-500 dark:text-light-800"
                  >
                    5+ years
                  </DropdownMenuCheckboxItem>

                  {uniquePositions.length > 0 &&
                    Object.keys(filters.positions).length > 0 && (
                      <>
                        <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                        <DropdownMenuLabel className="text-black-300 dark:text-light-500 text-xs">
                          Position
                        </DropdownMenuLabel>
                        {uniquePositions.map(
                          (position) =>
                            position && (
                              <DropdownMenuCheckboxItem
                                key={position}
                                checked={filters.positions[position] || false}
                                onCheckedChange={(checked) =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    positions: {
                                      ...prev.positions,
                                      [position]: !!checked,
                                    },
                                  }))
                                }
                                className="text-black-500 dark:text-light-800"
                              >
                                {position}
                              </DropdownMenuCheckboxItem>
                            ),
                        )}
                      </>
                    )}

                  {activeFilterCount > 0 && (
                    <>
                      <DropdownMenuSeparator className="dark:bg-dark-400 bg-gray-300" />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center text-xs text-red-100 hover:bg-red-100/10 hover:text-red-200 dark:text-red-100"
                        onClick={resetFilters}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Reset filters
                      </Button>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Search onSubmit={handleSearch} placeholder="Search applicants" />
          </div>
        </div>

        {/* Filter badges summary */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {sortField && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                Sort: {sortField} {sortDirection === "asc" ? "↑" : "↓"}
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() => setSortField(null)}
                />
              </Badge>
            )}

            {filters.hasPortfolio && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                Has portfolio
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, hasPortfolio: false }))
                  }
                />
              </Badge>
            )}

            {filters.noPortfolio && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                No portfolio
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, noPortfolio: false }))
                  }
                />
              </Badge>
            )}

            {/* More filter badges... */}
            {/* GitHub filters */}
            {filters.hasGithub && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                Has GitHub
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, hasGithub: false }))
                  }
                />
              </Badge>
            )}

            {filters.noGithub && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                No GitHub
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, noGithub: false }))
                  }
                />
              </Badge>
            )}

            {/* Assessment filters */}
            {filters.assessmentSent && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                Assessment sent
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, assessmentSent: false }))
                  }
                />
              </Badge>
            )}

            {filters.assessmentNotSent && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                Assessment not sent
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      assessmentNotSent: false,
                    }))
                  }
                />
              </Badge>
            )}

            {/* Experience filters */}
            {filters.experienceRanges.novice && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                0-2 years
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      experienceRanges: {
                        ...prev.experienceRanges,
                        novice: false,
                      },
                    }))
                  }
                />
              </Badge>
            )}

            {filters.experienceRanges.intermediate && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                3-5 years
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      experienceRanges: {
                        ...prev.experienceRanges,
                        intermediate: false,
                      },
                    }))
                  }
                />
              </Badge>
            )}

            {filters.experienceRanges.expert && (
              <Badge className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1">
                5+ years
                <X
                  className="ml-1 h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      experienceRanges: {
                        ...prev.experienceRanges,
                        expert: false,
                      },
                    }))
                  }
                />
              </Badge>
            )}

            {/* Position filters */}
            {Object.entries(filters.positions || {})
              .filter(([_, isSelected]) => isSelected)
              .map(([position]) => (
                <Badge
                  key={position}
                  className="bg-light-800 dark:bg-dark-300 text-black-500 dark:text-light-800 flex items-center gap-1"
                >
                  {position}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        positions: { ...prev.positions, [position]: false },
                      }))
                    }
                  />
                </Badge>
              ))}

            {activeFilterCount > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 py-0 text-xs text-red-100 hover:text-red-200 dark:text-red-100"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

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
          />
        )}
      </Box>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default ApplicantsPageClient;
