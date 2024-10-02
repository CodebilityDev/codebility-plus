import { PositionTitle } from "../data";

export interface interns_FilterInternsT {
    filters: PositionTitle[]; 
    setFilters: React.Dispatch<React.SetStateAction<PositionTitle[]>>;
  }