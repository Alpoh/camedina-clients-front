import type { User } from "@/lib/types/user";

// App-level profiles (name, role, clientId) for accounts that also need a
// real backend User — see lib/api/auth.ts. The backend has no
// roles/clientId concept, so this mapping stays local; passwords now live
// only in the backend (bcrypt-hashed), not here. For these demo accounts to
// be able to log in, each email below must also be registered against the
// backend (POST /api/v1/auth/register) with a matching password.
export const users: User[] = [
  {
    id: "user-admin-1",
    name: "Dana Reyes",
    email: "dana@camedina.com",
    role: "admin",
  },
  {
    id: "user-admin-2",
    name: "Sam Ito",
    email: "sam@camedina.com",
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
