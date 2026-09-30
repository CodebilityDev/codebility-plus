import type {
  ApplicantFilters,
  NewApplicantType,
  SortOption,
} from "@/types/home/applicants/applicants";

export function filterAndSortApplicants({
  applicants,
  filters,
  sortField,
  sortDirection,
  sortOptions,
  searchTerm,
}: {
  applicants: NewApplicantType[];
  filters: ApplicantFilters;
  sortField: string | null;
  sortDirection: "asc" | "desc";
  sortOptions: SortOption[];
  searchTerm: string;
}): NewApplicantType[] {
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


  return filteredApplicants;
}
