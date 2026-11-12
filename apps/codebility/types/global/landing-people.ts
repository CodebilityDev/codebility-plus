export const teamFilters = ["all", "admins", "mentors", "codevs"] as const;

export type TeamFilter = (typeof teamFilters)[number];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  imageSrc?: string;
  badgeRole: "admin" | "mentor" | "codev";
  badgeLabel: string;
}

export interface TeamCounts {
  all: number;
  admins: number;
  mentors: number;
  codevs: number;
}

export interface LandingTeamData {
  counts: TeamCounts;
  featured: TeamMember[];
  all: TeamMember[];
  admins: TeamMember[];
  mentors: TeamMember[];
  codevs: TeamMember[];
}

export interface LandingTeamPage {
  counts: TeamCounts;
  members: TeamMember[];
  filter: TeamFilter;
  page: number;
  total: number;
  totalPages: number;
}

export type CommunityMember = Pick<
  TeamMember,
  "id" | "name" | "initials" | "imageSrc"
>;
