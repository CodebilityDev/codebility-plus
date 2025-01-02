import { Member } from "../_types/projects";

export const parseMembers = (membersData: string[]): Member[] => {
  return membersData.map((member) => JSON.parse(member) as Member);
};