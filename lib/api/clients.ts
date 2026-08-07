import "server-only";
import { clients } from "@/lib/mock-data/clients";
import type { Client } from "@/lib/types/client";

export async function getClients(): Promise<Client[]> {
  return clients;
}

export async function getClientById(id: string): Promise<Client | null> {
  return clients.find((c) => c.id === id) ?? null;
}
