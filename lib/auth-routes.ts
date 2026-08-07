import type { Role } from "@/lib/types/user";

export function homeForRole(role: Role): "/admin" | "/portal" {
  return role === "admin" ? "/admin" : "/portal";
}
