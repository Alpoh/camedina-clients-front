import "server-only";
import { users, mockPasswords } from "@/lib/mock-data/users";
import { clients } from "@/lib/mock-data/clients";
import type { User } from "@/lib/types/user";
import type { Client } from "@/lib/types/client";

export async function authenticate(
  email: string,
  password: string,
): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) return null;
  if (mockPasswords[user.email] !== password) return null;
  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((u) => u.id === id) ?? null;
}

// Mock-only account creation: pushes into the in-memory mock arrays, so new
// accounts live only for the life of the server process. Signature mirrors
// what a real "create account" API call would return, so swapping the body
// for a real fetch() later is a contained change.
export async function registerClient(input: {
  name: string;
  company: string;
  email: string;
  password: string;
}): Promise<User | null> {
  const normalizedEmail = input.email.trim().toLowerCase();
  const emailTaken = users.some(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );
  if (emailTaken) return null;

  const suffix = Math.random().toString(36).slice(2, 8);

  const client: Client = {
    id: `client-${suffix}`,
    name: input.company,
    contactEmail: input.email,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  clients.push(client);

  const user: User = {
    id: `user-client-${suffix}`,
    name: input.name,
    email: input.email,
    role: "client",
    clientId: client.id,
  };
  users.push(user);
  mockPasswords[user.email] = input.password;

  return user;
}
