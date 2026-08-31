import type { User } from "@/lib/types/user";

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
