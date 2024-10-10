import { PositionTitle } from "../data";

export type interns_FilterInternsT = {
    filters: PositionTitle[]; 
    setFilters: React.Dispatch<React.SetStateAction<PositionTitle[]>>;
  }