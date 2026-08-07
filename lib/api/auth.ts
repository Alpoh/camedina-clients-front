import "server-only";
import { users, mockPasswords } from "@/lib/mock-data/users";
import { createClient } from "@/lib/api/clients";
import { ApiError } from "@/lib/api/http";
import type { User } from "@/lib/types/user";

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

// Accounts (User, role, session) stay mocked — the backend has no auth yet.
// The Client each new signup creates is real, though: it's a genuine record
// in the backend, created via the same createClient() the admin CRUD uses.
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

  let client;
  try {
    client = await createClient({ name: input.company, email: input.email });
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return null;
    throw err;
  }

  const user: User = {
    id: `user-client-${client.id}`,
    name: input.name,
    email: input.email,
    role: "client",
    clientId: client.id,
  };
  users.push(user);
  mockPasswords[user.email] = input.password;

  return user;
}
