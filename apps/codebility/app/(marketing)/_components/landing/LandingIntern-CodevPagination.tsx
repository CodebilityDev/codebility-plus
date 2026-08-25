"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import InternCards from "./LandingIntern-CodevCard";
import { prioritizeCodevs } from "@/utils/codev-priority";

// Type definitions for the two roles from database
type PersonRole = 'Intern' | 'Codev';

type TeamMember = {
  id: string;
  name: string;
  role: PersonRole; // Either Intern or Codev from roles table
  image?: string;
  display_position?: string;
  years_of_experience?: number;
  internal_status?: string;
  level?: Record<string, any>;
  codev_points?: Array<{
    id: string;
    codev_id?: string;
    skill_category_id?: string;
    points: number;
  }>;
  work_experience?: Array<any>;
};

interface TeamMembersApiResponse {
  TEAM_MEMBERS: { 
    id: string;
    name: string; 
    role: string; 
    image?: string; 
    display_position?: string;
    years_of_experience?: number;
    internal_status?: string;
    level?: Record<string, any>;
    codev_points?: Array<{
      id: string;
      codev_id?: string;
      skill_category_id?: string;
      points: number;
    }>;
    work_experience?: Array<any>;
  }[];
  error?: string;
}

// Role constants for better code maintainability
const TEAM_ROLES = {
  INTERN: 'Intern' as const,
  CODEV: 'Codev' as const,
} as const;

export default function TeamMembersPagination({allTeamMembers}: {allTeamMembers: TeamMembersApiResponse}) {
  console.log(allTeamMembers);

  const teamMembers = allTeamMembers.TEAM_MEMBERS.map((member) => member as TeamMember)

  // const ITEMS_PER_PAGE = 10;

  // Helper functions for role identification
  // const isInternRole = (role: string): boolean => role === TEAM_ROLES.INTERN;
  // const isCodevRole = (role: string): boolean => role === TEAM_ROLES.CODEV;
  // const validateTeamRole = (role: string): PersonRole => {
  //   return isCodevRole(role) ? TEAM_ROLES.CODEV : TEAM_ROLES.INTERN;
  // };

  // const totalPages = Math.max(1, Math.ceil(allTeamMembers.length / ITEMS_PER_PAGE));

  // Ensure current page stays within valid range
  // useEffect(() => {
  //   if (currentPage > totalPages) setCurrentPage(totalPages);
  //   if (currentPage < 1) setCurrentPage(1);
  // }, [currentPage, totalPages]);

  // const currentPageTeamMembers = allTeamMembers.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE, 
  //   currentPage * ITEMS_PER_PAGE
  // );

  // Navigation functions
  // const goToPreviousPage = () => {
  //   setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  // };

  // const goToNextPage = () => {
  //   setCurrentPage((prevPage) => Math.min(totalPages, prevPage + 1));
  // };

  // const handlePreviousPageClick = () => {
  //   goToPreviousPage();
  // };

  // const handleNextPageClick = () => {
  //   goToNextPage();
  // };

  // Button disabled states
  // const isPreviousPageDisabled = currentPage <= 1 || isLoading;
  // const isNextPageDisabled = currentPage >= totalPages || isLoading;

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-full min-h-[300px]">
        <InternCards interns={teamMembers} />
      </div>

      {/* Pagination Controls for Team Members */}
      {/* <div className="flex items-center gap-3 relative z-[100] mt-8">
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
      </div> */}

      
    </div>
  );
}