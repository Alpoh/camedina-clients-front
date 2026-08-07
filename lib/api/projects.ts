import "server-only";
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from "@/lib/api/http";
import type { Project, ProjectInput } from "@/lib/types/project";
import type { Page } from "@/lib/types/pagination";
import { getClients } from "@/lib/api/clients";

export async function getProjectsByClientId(
  clientId: string,
): Promise<Project[]> {
  const page = await apiGet<Page<Project>>(
    `/api/v1/clients/${clientId}/projects?page=0&size=100`,
  );
  return page.content;
}

// Real, single fetch — used wherever the caller already knows which client
// the project belongs to (e.g. the portal, scoped by the session). A
// cross-client id/projectId pair 404s directly from the backend.
export async function getProjectByClientAndId(
  clientId: string,
  projectId: string,
): Promise<Project | null> {
  return apiGetOrNull<Project>(
    `/api/v1/clients/${clientId}/projects/${projectId}`,
  );
}

// The backend only exposes projects as a client sub-resource — there's no
// global "all projects" or "project by id" endpoint yet (flagged as a gap
// in docs/PROJECTS_PROPOSAL.md). Until that exists, the admin's cross-client
// views fan out: fetch every client, then every client's projects, and
// combine client-side. Fine at today's client counts; revisit if a global
// listing endpoint gets added.
export async function getProjects(): Promise<Project[]> {
  const clients = await getClients();
  const perClient = await Promise.all(
    clients.map((client) => getProjectsByClientId(client.id)),
  );
  return perClient.flat();
}

export async function getProjectById(id: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) ?? null;
}

export async function createProject(
  clientId: string,
  input: ProjectInput,
): Promise<Project> {
  return apiPost<Project>(`/api/v1/clients/${clientId}/projects`, input);
}

export async function updateProject(
  clientId: string,
  projectId: string,
  input: ProjectInput,
): Promise<Project> {
  return apiPut<Project>(
    `/api/v1/clients/${clientId}/projects/${projectId}`,
    input,
  );
}

export async function deleteProject(
  clientId: string,
  projectId: string,
): Promise<void> {
  return apiDelete(`/api/v1/clients/${clientId}/projects/${projectId}`);
}
