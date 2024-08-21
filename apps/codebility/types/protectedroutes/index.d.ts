import React from "react"
import { TaskT, ListT, TeamMemberT, ProjectT, BoardUserT, BoardProjectT } from "@/types/index"
import { positionTitles } from "@/app/home/interns/data"

type client_ClientCardT = {
  id: string
  company_name: string
  company_logo?: string
  working_hours?: string[]
  email?: string
  contact_number?: string
  linkedin_link?: string
  location?: string
  company_hist?: string[]
  isArchive?: boolean
  client_start_time?: string
  client_end_time?: string
  created_at: string
  updated_at: string
  projects: ProjectT[]
}

type dash_StatusT = {
  jobStatusType: "DEPLOYED" | "AVAILABLE"
  userId: string
}

type dash_TimeTrackerT = {
  id: string
  created_at: string
  updated_at: string
  project_name: string
  name: string
  boardOnUsers: BoardUserT[]
  boardProjects: BoardProjectT[]
  lists: ListT[]
}

type inhouse_EditTableBodyT = {
  member: TeamMemberT
  handleSaveButton: (member: TeamMemberT) => void
}

type inhouse_TableBodyT = {
  member: TeamMemberT
  handleEditButton: (id: number) => void
}

type inhouse_TableHeader = {
  onSort: (key: keyof TeamMemberT, direction: "up" | "down") => void
}

type inhouse_TableHeader2 = {
  title: "First Name" | "Last Name" | "Status" | "Position" | "Project" | "NDA" | "Actions"
  type: keyof TeamMemberT
  className?: string
  onSort: (key: keyof TeamMemberT, direction: "up" | "down") => void
}

interface ISelectProps {
  type: "status_internal" | "main_positon" | "nda_status"
  placeholder?: string
  handleChange: (value: string) => void
  className?: string
}

type interns_FilterInternsT = {
  filters: Partial<(typeof positionTitles)[number]>[]
  setFilters: React.Dispatch<SetStateAction<FilterInternsProps["filters"]>>
}

type kanban_Kanban = {
  id: string
  created_at: string
  updated_at: string
  project_name: string
  name: string
  boardOnUsers: BoardUserT[]
  boardProjects: BoardProjectT[]
  lists: ListT[]
}

type kanban_ColumnContainerT = {
  column: ListT
  projectId?: string
  tasks: TaskT[]
}

type kanban_KanbanTaskT = {
  task: TaskT
  listName: string
}

type org_CardT = {
  name: string
  position: string
  image: string
  children?: OrgChartData[]
}


type resume_SkillsT = {
  tech_stacks: string[]
  updateProfile: (updatedData: any) => void
}

type permissions_TableRowProps = {
  id: string
  name: string
  usersId: string
  dashboard: boolean
  my_task: boolean
  kanban: boolean
  time_tracker: boolean
  clients: boolean
  interns: boolean
  inhouse: boolean
  projects: boolean
  applicants: boolean
  roles: boolean
  permissions: boolean
  services: boolean
}

type service_FormValuesT = {
  id?: string;
  name: string
  category: string
  description: string
  mainImage?: File | null
  picture1?: File | null
  picture2?: File | null
}
