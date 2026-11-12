export interface HireTalentLevel {
  id: string;
  name: string;
  level: number;
}

export interface HireTalentProfile {
  id: string;
  name: string;
  role: string;
  imageSrc?: string;
  initials: string;
  available: boolean;
  levels: HireTalentLevel[];
  tech: string[];
}
