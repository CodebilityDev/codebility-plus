import { z } from "zod";

const PathsSchema = z.object({
  auth: z.object({
    signIn: z.string().min(1),
    signUp: z.string().min(1),
    callback: z.string().min(1),
    passwordReset: z.string().min(1),
  }),
  app: z.object({
    home: z.string().min(1),
    applicants: z.string().min(1),
    clients: z.string().min(1),
    in_hose: z.string().min(1),
    interns: z.string().min(1),
    kanban: z.string().min(1),
    orgchart: z.string().min(1),
    projects: z.string().min(1),
    tasks: z.string().min(1),
    time_tracker: z.string().min(1),
    settings: z.string().min(1),
    roles: z.string().min(1),
    services: z.string().min(1),
    permissions: z.string().min(1),
    resume: z.string().min(1),
    admin_dashboard: z.string().min(1),
  }),
});

const pathsConfig = PathsSchema.parse({
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    callback: "/auth/callback",
    passwordReset: "/auth/password-reset",
  },
  app: {
    home: "/home",
    applicants: "/home/applicants",
    clients: "/home/clients",
    in_hose: "/home/in-house",
    interns: "/home/interns",
    kanban: "/home/kanban",
    orgchart: "/home/orgchart",
    projects: "/home/projects",
    tasks: "/home/tasks",
    time_tracker: "/home/time-tracker",
    settings: "/home/settings",
    roles: "/home/settings/roles",
    services: "/home/settings/services",
    permissions: "/home/settings/permissions",
    resume: "/home/settings/resume",
    admin_dashboard: "/home/admin-dashboard",
  },
} satisfies z.infer<typeof PathsSchema>);

export default pathsConfig;
