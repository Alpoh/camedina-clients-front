export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "blocked"
  | "review"
  | "done";

export type Project = {
  id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  updatedAt: string;
  description?: string;
};
