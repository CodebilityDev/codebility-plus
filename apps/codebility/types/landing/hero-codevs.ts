export interface HeroCodev {
  id: string;
  name: string;
  role: string;
  initials: string;
  imageSrc?: string;
  skills: string[];
  verified: boolean;
}

export interface HeroCodevPage {
  codevs: HeroCodev[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HeroCodevSearchResult extends HeroCodevPage {
  query: string;
}

export type LandingSearchParams = Promise<
  Record<string, string | string[] | undefined>
>;
