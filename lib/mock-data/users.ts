import type { User } from "@/lib/types/user";

// Mock-only demo accounts. Passwords are plaintext here purely as a stand-in
// for a real auth provider — this map (and this whole file) gets replaced
// wholesale once the real backend/OpenAPI spec is wired up.
export const users: User[] = [
  {
    id: "user-admin-1",
    name: "Dana Reyes",
    email: "dana@agency.test",
    role: "admin",
  },
  {
    id: "user-admin-2",
    name: "Sam Ito",
    email: "sam@agency.test",
    role: "admin",
  },
  {
    id: "user-client-acme",
    name: "Jordan Lee",
    email: "jordan@acme.test",
    role: "client",
    clientId: "client-acme",
  },
  {
    id: "user-client-borealis",
    name: "Priya Shah",
    email: "priya@borealis.test",
    role: "client",
    clientId: "client-borealis",
  },
  {
    id: "user-client-fernwood",
    name: "Marcus Webb",
    email: "marcus@fernwood.test",
    role: "client",
    clientId: "client-fernwood",
  },
];

export const mockPasswords: Record<string, string> = {
  "dana@agency.test": "demo1234",
  "sam@agency.test": "demo1234",
  "jordan@acme.test": "demo1234",
  "priya@borealis.test": "demo1234",
  "marcus@fernwood.test": "demo1234",
};
