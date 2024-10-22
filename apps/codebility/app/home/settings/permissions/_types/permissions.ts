export type permissions_TableRowProps = {
  id: string
  name: string
  usersId?: string
  // MENU
  dashboard: boolean
  tasks: boolean
  kanban: boolean
  time_tracker: boolean
  // CODEVS
  interns: boolean
  orgchart: boolean
  // MANAGEMENT
  applicants: boolean
  in_house: boolean
  clients: boolean
  projects: boolean
  settings: boolean
  // SETTINGS
  resume: boolean
  roles: boolean
  permissions: boolean
  services: boolean
}
