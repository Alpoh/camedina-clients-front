import "server-only";
import { projects } from "@/lib/mock-data/projects";
import type { Project } from "@/lib/types/project";

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProjectById(id: string): Promise<Project | null> {
  return projects.find((p) => p.id === id) ?? null;
}

export async function getProjectsByClientId(
  clientId: string,
): Promise<Project[]> {
  return projects.filter((p) => p.clientId === clientId);
}
