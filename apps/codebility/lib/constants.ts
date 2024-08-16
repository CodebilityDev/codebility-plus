const Url = process.env.NEXT_PUBLIC_BASE_API
  ? `${process.env.NEXT_PUBLIC_BASE_API}`
  : "https://codebility-be-ng67.onrender.com/api/v1/production"

export const API = {
  USERS: `${Url}/users/`,

  ADMINS: `${Url}/users/admins`,
  APPLICANTS: `${Url}/users/applicant`,
  CODEVS: `${Url}/users`,
  INTERNS: `${Url}/users/interns`,
  ROLES: `${Url}/users/roles`,

  APPROVE_APPLICANT: `${Url}/users/accept-applicant`,
  DENY_APPLICANT: `${Url}/users/deny`,

  TASKS: `${Url}/tasks`,
  CLIENTS: `${Url}/clients`,
  PROJECTS: `${Url}/projects`,
  BOARDS: `${Url}/boards`,
}
