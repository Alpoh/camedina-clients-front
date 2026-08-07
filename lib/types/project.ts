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
  createdAt: string;
  updatedAt: string;
  description?: string;
};

export type ProjectInput = {
  name: string;
  status: ProjectStatus;
  description?: string;
};
