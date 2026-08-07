import "server-only";
import { apiGet, apiGetOrNull, apiPost, apiPut, apiDelete } from "@/lib/api/http";
import type { Client, ClientInput } from "@/lib/types/client";
import type { Page } from "@/lib/types/pagination";

export async function getClients(): Promise<Client[]> {
  const page = await apiGet<Page<Client>>(
    "/api/v1/clients?page=0&size=100&sort=name,asc",
  );
  return page.content;
}

export async function getClientById(id: string): Promise<Client | null> {
  return apiGetOrNull<Client>(`/api/v1/clients/${id}`);
}

export async function createClient(input: ClientInput): Promise<Client> {
  return apiPost<Client>("/api/v1/clients", input);
}

export async function updateClient(
  id: string,
  input: ClientInput,
): Promise<Client> {
  return apiPut<Client>(`/api/v1/clients/${id}`, input);
}

export async function deleteClient(id: string): Promise<void> {
  return apiDelete(`/api/v1/clients/${id}`);
}
