import type { Codev } from "@/types/global/codev";

export interface CodevsProfilesPage {
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
