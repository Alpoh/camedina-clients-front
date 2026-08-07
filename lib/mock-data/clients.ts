import type { Client } from "@/lib/types/client";

export const clients: Client[] = [
  {
    id: "client-acme",
    name: "Acme Co",
    contactEmail: "hello@acme.test",
    createdAt: "2026-03-01",
  },
  {
    id: "client-borealis",
    name: "Borealis Studio",
    contactEmail: "team@borealis.test",
    createdAt: "2026-04-12",
  },
  {
    id: "client-fernwood",
    name: "Fernwood Bakery",
    contactEmail: "owner@fernwood.test",
    createdAt: "2026-05-20",
  },
];
