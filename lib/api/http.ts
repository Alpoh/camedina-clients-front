import "server-only";
import { cookies } from "next/headers";

const BASE_URL = process.env.BACKEND_API_URL ?? "http://localhost:8080";
const TOKEN_COOKIE = "backend_token";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Reads the token's `exp` claim (no signature check — the frontend doesn't
// hold the backend's signing secret) so the cookie doesn't outlive the JWT.
function jwtExpiry(token: string): Date | undefined {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    ) as { exp?: number };
    return payload.exp ? new Date(payload.exp * 1000) : undefined;
  } catch {
    return undefined;
  }
}

// Stores the backend's own JWT (from /api/v1/auth/register or /login) in a
// cookie separate from lib/session.ts's app-level session — every endpoint
// but auth/health requires it as `Authorization: Bearer <token>`.
export async function setBackendToken(token: string) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: jwtExpiry(token),
  });
}

export async function clearBackendToken() {
  (await cookies()).delete(TOKEN_COOKIE);
}

async function request<T>(
  path: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  const authToken = token ?? (await cookies()).get(TOKEN_COOKIE)?.value;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const problem = (await res.json()) as { detail?: string };
      detail = problem.detail ?? detail;
    } catch {
      // response wasn't a ProblemDetail body — keep the status text
    }
    throw new ApiError(res.status, detail);
  }

  return res.json() as Promise<T>;
}

export function apiGet<T>(path: string, token?: string): Promise<T> {
  return request<T>(path, undefined, token);
}

export function apiPost<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  return request<T>(
    path,
    { method: "POST", body: JSON.stringify(body) },
    token,
  );
}

export function apiPut<T>(
  path: string,
  body: unknown,
  token?: string,
): Promise<T> {
  return request<T>(
    path,
    { method: "PUT", body: JSON.stringify(body) },
    token,
  );
}

export function apiDelete(path: string, token?: string): Promise<void> {
  return request<void>(path, { method: "DELETE" }, token);
}

// Fetches a resource by id, treating a 404 from the backend as "not found"
// rather than an error to propagate — matches the `T | null` pattern the
// rest of the app already expects from getXById-style lookups.
export async function apiGetOrNull<T>(
  path: string,
  token?: string,
): Promise<T | null> {
  try {
    return await apiGet<T>(path, token);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
