import React from 'react'
import { ExperienceType } from "@/app/(protectedroutes)/settings/resume/Experience"

type TStatus = "Available" | "Deployed" | "Training" | "Vacation" | "Busy" | "Client Ready" | "Blocked" | "Graduated"

type TPosition =
  | "Frontend Developer"
  | "Backend Developer"
  | "Fullstack Developer"
  | "Mobile Developer"
  | "UI/UX Designer"
  | "Graphic Designer"
  | "Social Media Manager"
  | "Digital Marketer"
  | "Human Resource"
  | "Video Editor"
  | "Project Manager"
  | "Admin"
  | "CEO"

type TNda = "Received" | "Sent"

type User = {
  id: string
  first_name: string
  last_name: string
  about_me?: string
  image_icon?: string
  image_url?: string | null

  pronoun?: string | null
  address?: string
  email_address?: string | null
  phone_no?: string | null
  github_link?: string | null
  fb_link?: string | null
  linkedin_link?: string | null
  whatsapp_link?: string | null
  skype_link?: string | null
  telegram_link?: string | null
  portfolio_website?: string | null
  tech_stacks?: string[]
  addtl_skills?: string[]
  about_me?: string | null
  education?: string | null
  created_at?: string
  updated_at?: string
  schedule?: string | null
  position?: string[]
  roleType?: string
  userType?: string
  projects?: any[]
  clientId?: string
  main_position?: string
  start_time?: string | null
  end_time?: string | null
  jobStatusType?: string
  prio?: number
  Work_Experience: ExperienceType[] | []
}

type Tag = {
  tag: string
}

type Sidebar = {
  id: string
  title: string
  links: Link[]
}

type Link = {
  route: string
  imgURL: string
  label: string
  permission: string
}

type SocialIcons = {
  imgURL: string
  route: string
  label: string
}

type topNotcher = {
  id: number
  ranking: number
  name: string
  role: string
  level: number
}

type TaskT = {
  id: string
  title: string
  subheader: string
  full_description: string
  userTodoId: string | null
  projectId: string | null
  task_points: number
  prio_level: string
  github_link: string
  created_at: string
  duration: string
  listId: string
  created_at: Date
  updated_at: string
  task_category: string
  task_type: string
  pr_link: string
  tagId: string[]
  tags: Tag[]
  userTodo: any
  userTask: [
    {
      id: string
      first_name: string
      last_name: string
      image_url: string
    },
  ]
  projects: any
}

type ListT = {
  [x: string]: any
  id: string
  created_at: string
  updated_at: string
  name: string
  boardId: string
  task: []
}

interface IInhouse {
  data: TeamMemberT[]
  editableIds: number[]
  handlers: {
    setData: React.Dispatch<React.SetStateAction<TeamMemberT[]>>
    handleEditButton: (id: number) => void
    handleSaveButton: (updatedMember: TeamMemberT) => void
  }
  status: {
    LoadinginHouse: boolean
    ErrorinHouse: Error | null
  }
  currentPage: number
  totalPages: number
  handleNextPage: () => void
  handlePreviousPage: () => void
}

type TeamMemberT = {
  id: number
  first_name: string
  last_name: string
  status_internal: TStatus
  main_position: TPosition
  projects?: { project: Project }[]
  nda_status?: TNda
}

interface Project {
  id: string
  project_name: string
}

type ProjectT = {
  id?: string
  project_name?: string
  github_link?: string
  summary?: string
  project_status?: string
  live_link?: string | null
  clientId?: string
  team_leader_id?: string
  team_leader?: User
  users?: User[]
  project_thumbnail?: string | null
  created_at?: Date | any
  updated_at?: string
}

type BoardUserT = {
  id: string
  created_at: string
  updated_at: string
  userOnBoardId: string
  boardOnUsersId: string
  usersBoard: { name: string } | null
}

type BoardProjectT = {
  id: string
  usersId: string | null
  projectsId: string
  boardId: string
  project: { project_name: string; team_leader: User }
}

type ServiceCardT = {
  icon: any
  title: string
  desc: string
}

type AddBase = (styles: Record<string, any>) => void;

type MatchUtilities = (
  utilities: Record<string, (value: string) => object>,
  options: { values: Record<string, string>; type: string }
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
  User,
  BoardProjectT,
  BoardUserT,
  ProjectT,
  TeamMemberT,
  ListT,
  TaskT,
  topNotcher,
  SocialIcons,
  Tag,
  TStatus,
  ServiceCardT,
  Sidebar,
  IInhouse,
  AddVariablesForColorsParams,
  PluginFunctionParams
}
