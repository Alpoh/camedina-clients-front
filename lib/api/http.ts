import "server-only";
import { cookies } from "next/headers";
import { Agent } from "undici";

const BASE_URL = process.env.BACKEND_API_URL ?? "http://localhost:8080";
const TOKEN_COOKIE = "backend_token";

const selfSignedDispatcher =
  process.env.NODE_ENV !== "production" &&
  process.env.BACKEND_ALLOW_SELF_SIGNED_CERT === "true"
    ? new Agent({ connect: { rejectUnauthorized: false } })
    : undefined;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

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
  const requestInit: RequestInit & { dispatcher?: Agent } = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
    ...(selfSignedDispatcher ? { dispatcher: selfSignedDispatcher } : {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, requestInit);

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const problem = (await res.json()) as { detail?: string };
      detail = problem.detail ?? detail;
    } catch {}
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
