import React from "react";
import { ExperienceType } from "@/app/home/settings/resume/experience";

type Tag = {
  tag: string;
};

type Sidebar = {
  id: string;
  title: string;
  links: Link[];
};

type topNotcher = {
  id: number;
  ranking: number;
  name: string;
  role: string;
  level: number;
};

interface IInhouse {
  data: TeamMemberT[];
  editableIds: number[];
  handlers: {
    setData: React.Dispatch<React.SetStateAction<TeamMemberT[]>>;
    handleEditButton: (id: number) => void;
    handleSaveButton: (updatedMember: TeamMemberT) => void;
  };
  status: {
    LoadinginHouse: boolean;
    ErrorinHouse: Error | null;
  };
  currentPage: number;
  totalPages: number;
  handleNextPage: () => void;
  handlePreviousPage: () => void;
}

type TeamMemberT = {
  id: number;
  first_name: string;
  last_name: string;
  status_internal: TStatus;
  main_position: TPosition;
  projects?: { project: Project }[];
  nda_status?: TNda;
};

type ViewType = {
  first_name: string;
  last_name: string;
};

type ProjectT = {
  id?: string;
  name?: string;
  github_link?: string;
  summary?: string;
  status?: string;
  figma_link?: string;
  live_link?: string | null;
  client_id?: string;
  team_leader_id?: string;
  team_leader?: User;
  users?: User[];
  thumbnail?: string | null;
  created_at?: Date | any;
  updated_at?: string;
  members: string[];
  view_type: ViewType;
};

type BoardUserT = {
  id: string;
  created_at: string;
  updated_at: string;
  userOnBoardId: string;
  boardOnUsersId: string;
  usersBoard: { name: string } | null;
};

type BoardProjectT = {
  id: string;
  usersId: string | null;
  projectsId: string;
  boardId: string;
  project: { project_name: string; team_leader: User };
};

type ServiceCardT = {
  icon: any;
  title: string;
  desc: string;
};

type AddBase = (styles: Record<string, any>) => void;

type MatchUtilities = (
  utilities: Record<string, (value: string) => object>,
  options: { values: Record<string, string>; type: string },
) => void;

interface AddVariablesForColorsParams {
  addBase: AddBase;
  theme: any;
}

interface PluginFunctionParams {
  matchUtilities: MatchUtilities;
  theme: any;
}

export {
  BoardProjectT,
  BoardUserT,
  ProjectT,
  TeamMemberT,
  topNotcher,
  Tag,
  ServiceCardT,
  Sidebar,
  IInhouse,
  AddVariablesForColorsParams,
  PluginFunctionParams,
};
