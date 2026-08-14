import "server-only";
import { users } from "@/lib/mock-data/users";
import { createClient } from "@/lib/api/clients";
import { apiPost, setBackendToken, ApiError } from "@/lib/api/http";
import type { User } from "@/lib/types/user";

type AuthResponse = { token: string };

// The backend's User is just {email, passwordHash} with no roles/clientId
// (see docs/API.md: "no roles/authorities yet — every authenticated caller
// can do everything"). `users` here is still an in-memory profile table —
// it maps an authenticated email to the app-level role/name/clientId the
// backend doesn't know about — but the backend now owns password
// verification and issues the bearer token every other endpoint requires.
export async function authenticate(
  email: string,
  password: string,
): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const profile = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!profile) return null;

  let token: string;
  try {
    ({ token } = await apiPost<AuthResponse>("/api/v1/auth/login", {
      email,
      password,
    }));
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }

  await setBackendToken(token);
  return profile;
}

export async function getUserById(id: string): Promise<User | null> {
  return users.find((u) => u.id === id) ?? null;
}

// The account (User, role, session) is still an app-level profile layered on
// top of a real backend account: registerClient calls the real
// /api/v1/auth/register, then reuses the freshly-issued token (the cookie
// isn't set yet at this point, so it's passed explicitly) to create a real
// Client via the same createClient() the admin CRUD uses.
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

  let token: string;
  try {
    ({ token } = await apiPost<AuthResponse>("/api/v1/auth/register", {
      email: input.email,
      password: input.password,
    }));
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return null;
    throw err;
  }

  let client;
  try {
    client = await createClient(
      { name: input.company, email: input.email },
      token,
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return null;
    throw err;
  }

  await setBackendToken(token);

  const user: User = {
    id: `user-client-${client.id}`,
    name: input.name,
    email: input.email,
    role: "client",
    clientId: client.id,
  };
  users.push(user);

  return user;
}
