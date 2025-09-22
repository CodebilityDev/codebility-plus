// components/landing/LandingIntern-CodevPagination.tsx

"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InternCards from "./LandingIntern-CodevCard";

// Type definitions for the two roles from database
type PersonRole = 'Intern' | 'Codev';

type TeamMember = {
  name: string;
  role: PersonRole; // Either Intern or Codev from roles table
  image?: string;
  display_position?: string;
};

interface TeamMembersApiResponse {
  INTERNS: { // Keep as INTERNS to match current API response, you may modify later
    name: string; 
    role: string; 
    image?: string; 
    display_position?: string 
  }[];
  error?: string;
}

// Role constants for better code maintainability
const TEAM_ROLES = {
  INTERN: 'Intern' as const,
  CODEV: 'Codev' as const,
} as const;

export default function TeamMembersPagination() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allTeamMembers, setAllTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Helper functions for role identification
  const isInternRole = (role: string): boolean => role === TEAM_ROLES.INTERN;
  const isCodevRole = (role: string): boolean => role === TEAM_ROLES.CODEV;
  const validateTeamRole = (role: string): PersonRole => {
    return isCodevRole(role) ? TEAM_ROLES.CODEV : TEAM_ROLES.INTERN;
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAllTeamMembers = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const response = await fetch("/api/all-active-interns-codev");
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch team members: ${response.status} ${errorText}`);
        }

        const apiData = (await response.json()) as TeamMembersApiResponse;

        if (!apiData || !Array.isArray(apiData.INTERNS)) {
          console.warn("Unexpected API response shape for /api/all-active-interns-codev:", apiData);
          if (!isMounted) return;
          setAllTeamMembers([]);
        } else {
          // Map API response to TeamMember objects with proper role validation
          const mappedTeamMembers = apiData.INTERNS.map((member) => ({
            name: member.name,
            role: validateTeamRole(member.role), // Ensures only Intern or Codev roles
            image: member.image,
            display_position: member.display_position,
          }));
          
          if (!isMounted) return;
          setAllTeamMembers(mappedTeamMembers);
          setCurrentPage(1); // Reset to first page when new data loads
        }
      } catch (fetchErr: any) {
        console.error("Error fetching team members:", fetchErr);
        if (!isMounted) return;
        setFetchError(fetchErr?.message ?? "Unknown error occurred");
        setAllTeamMembers([]);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    fetchAllTeamMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(allTeamMembers.length / ITEMS_PER_PAGE));

  // Ensure current page stays within valid range
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  // Get current page team members (both Interns and Codevs)
  const currentPageTeamMembers = allTeamMembers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Navigation functions
  const goToPreviousPage = () => {
    console.log('goToPreviousPage called, current page:', currentPage);
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };
  
  const goToNextPage = () => {
    console.log('goToNextPage called, current page:', currentPage);
    setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  };

  const handlePreviousPageClick = () => {
    console.log('Previous page button clicked!');
    goToPreviousPage();
  };

  const handleNextPageClick = () => {
    console.log('Next page button clicked!');
    goToNextPage();
  };

  // Debug: Log the current pagination state
  console.log('Debug pagination state:', { 
    currentPage, 
    totalPages, 
    isLoading,
    totalTeamMembers: allTeamMembers.length 
  });

  // Button disabled states
  const isPreviousPageDisabled = currentPage <= 1 || isLoading;
  const isNextPageDisabled = currentPage >= totalPages || isLoading;

  console.log('Pagination button states:', {
    isPreviousPageDisabled,
    isNextPageDisabled,
    isFirstPage: currentPage <= 1,
    isLastPage: currentPage >= totalPages
  });

  // Helper function to count each role type for debugging
  const internMembers = allTeamMembers.filter(member => isInternRole(member.role));
  const codevMembers = allTeamMembers.filter(member => isCodevRole(member.role));

  console.log('Team composition:', { 
    totalInterns: internMembers.length, 
    totalCodevs: codevMembers.length, 
    totalMembers: allTeamMembers.length 
  });

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Team Members Cards Container (Both Interns and Codevs) */}
      <div className="w-full min-h-[300px]">
        {isLoading ? (
          <div className="py-12 text-sm text-gray-500 flex items-center justify-center">
            Loading team members…
          </div>
        ) : fetchError ? (
          <div className="py-12 text-sm text-red-500 flex items-center justify-center">
            Error: {fetchError}
          </div>
        ) : currentPageTeamMembers.length > 0 ? (
          <InternCards interns={currentPageTeamMembers} />
        ) : (
          <div className="py-12 text-sm text-gray-400 flex items-center justify-center">
            No team members available (Interns or Codevs)
          </div>
        )}
      </div>

      {/* Pagination Controls for Team Members */}
      <div className="flex items-center gap-3 relative z-[100] mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousPageClick}
          disabled={isPreviousPageDisabled}
          className="rounded-full w-9 h-9 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative z-[100] pointer-events-auto"
          style={{ position: 'relative', zIndex: 100 }}
        >
          <ChevronLeft size={16} className="shrink-0" />
        </Button>

        <div className="text-sm text-gray-600 dark:text-gray-300 px-4">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPageClick}
          disabled={isNextPageDisabled}
          className="rounded-full w-9 h-9 p-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed relative z-[100] pointer-events-auto"
          style={{ position: 'relative', zIndex: 100 }}
        >
          <ChevronRight size={16} className="shrink-0" />
        </Button>
      </div>

      
    </div>
  );
}