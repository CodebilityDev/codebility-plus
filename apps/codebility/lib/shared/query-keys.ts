export type ListArgs = Record<string, string | number | boolean | undefined>;

const list = (resource: string) => (args: ListArgs = {}) =>
  [resource, "list", args] as const;

const detail = (resource: string) => (id: string) =>
  [resource, "detail", id] as const;

export const qk = {
  codevs: { list: list("codevs"), detail: detail("codevs") },
  projects: { list: list("projects"), detail: detail("projects") },
  clients: { list: list("clients"), detail: detail("clients") },
  applicants: { list: list("applicants"), detail: detail("applicants") },
  tasks: { list: list("tasks"), detail: detail("tasks") },
  announcements: { list: list("announcements"), detail: detail("announcements") },
  reference: {
    roles: ["reference", "roles"] as const,
    positions: ["reference", "positions"] as const,
    projects: ["reference", "projects"] as const,
  },
};
