import "server-only";
import { createClient } from "@/lib/api/clients";
import { apiGetOrNull, apiPost, setBackendToken, ApiError } from "@/lib/api/http";
import type { Role, User } from "@/lib/types/user";

type BackendAuthResponse = { token: string; id: string; role: Role };

function displayNameFromEmail(email: string): string {
  return email.split("@")[0];
}

async function resolveClientId(
  email: string,
  role: Role,
  token: string,
): Promise<string | undefined> {
  if (role !== "client") return undefined;
  const client = await apiGetOrNull<{ id: string }>(
    `/api/v1/clients/by-email/${encodeURIComponent(email)}`,
    token,
  );
  return client?.id;
}

export async function authenticate(
  email: string,
  password: string,
): Promise<User | null> {
  let auth: BackendAuthResponse;
  try {
    auth = await apiPost<BackendAuthResponse>("/api/v1/auth/login", {
      email,
      password,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }

  await setBackendToken(auth.token);
  const clientId = await resolveClientId(email, auth.role, auth.token);

  return {
    id: auth.id,
    name: displayNameFromEmail(email),
    email,
    role: auth.role,
    clientId,
  };
}

export async function registerClient(input: {
  name: string;
  company: string;
  email: string;
  password: string;
}): Promise<User | null> {
  let auth: BackendAuthResponse;
  try {
    auth = await apiPost<BackendAuthResponse>("/api/v1/auth/register", {
      email: input.email,
      password: input.password,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return null;
    throw err;
  }

  await setBackendToken(auth.token);

  let client;
  try {
    client = await createClient(
      { name: input.company, email: input.email },
      auth.token,
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) return null;
    throw err;
  }

  return {
    id: auth.id,
    name: input.name,
    email: input.email,
    role: auth.role,
    clientId: client.id,
  };
}
