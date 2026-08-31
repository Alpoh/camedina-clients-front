export const PROJECT_STATUSES = [
  "planning",
  "in_progress",
  "blocked",
  "review",
  "done",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_DESCRIPTION_MAX_LENGTH = 2000;

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
