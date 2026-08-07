import type { ProjectStatus } from "@/lib/types/project";

export const statusLabel: Record<ProjectStatus, string> = {
  planning: "Planning",
  in_progress: "In progress",
  blocked: "Blocked",
  review: "Review",
  done: "Done",
};

export const statusVariant: Record<
  ProjectStatus,
  "neutral" | "success" | "warning" | "error"
> = {
  planning: "neutral",
  in_progress: "warning",
  blocked: "error",
  review: "warning",
  done: "success",
};
