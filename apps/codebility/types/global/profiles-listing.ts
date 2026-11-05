import type { Codev } from "@/types/global/codev";

export interface ProfilesListingPage {
  codevs: Codev[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  positions: string[];
  position: string;
}
