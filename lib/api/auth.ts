import "server-only";
import { users, mockPasswords } from "@/lib/mock-data/users";
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
