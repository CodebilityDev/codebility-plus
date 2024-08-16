import { ListT, ProjectT, BoardProjectT ,BoardUserT } from "@/types/index"

type modals_ConactUS = {
  name: string
  email: string
  telephone: any
  message: string
}

type modals_ProjectModal = {
  id: string
  company_name: string
  company_logo?: string
  working_hours?: string[]
  email?: string
  contact_number?: string
  linkedin_link?: string
  location?: string
  company_hist?: string[]
  client_start_time?: string
  client_end_time?: string
  created_at: string
  updated_at: string
  projects: ProjectT[]
}

type modals_TaskViewModal = {
  id: string
  created_at: string
  updated_at: string
  project_name: string
  name: string
  boardOnUsers: BoardUserT[]
  boardProjects: BoardProjectT[]
  lists: ListT[]
}

type modals_ClientAddModal = {
  id?: string
  company_name?: string
  email?: string
  company_logo?: string
  statusType?: string
  location?: string
  isArchive?: boolean
  contact_number?: string
  linkedin_link?: string
  client_start_time?: string
  client_end_time?: string
}
