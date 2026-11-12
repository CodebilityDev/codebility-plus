export type CommunityTrack =
  | "all"
  | "full-stack"
  | "frontend"
  | "backend"
  | "mobile"
  | "ui-ux"
  | "qa"
  | "mentors";

export interface CommunityCodev {
  id: string;
  name: string;
  role: string;
  initials: string;
  imageSrc?: string;
  mentor: boolean;
  tracks: CommunityTrack[];
}

export interface CommunityData {
  members: CommunityCodev[];
  total: number;
}
