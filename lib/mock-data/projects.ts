import type { Project } from "@/lib/types/project";

export const projects: Project[] = [
  {
    id: "proj-acme-site",
    clientId: "client-acme",
    name: "Marketing site redesign",
    status: "in_progress",
    updatedAt: "2026-08-01",
    description: "Full redesign of the public marketing site.",
  },
  {
    id: "proj-acme-seo",
    clientId: "client-acme",
    name: "SEO audit & fixes",
    status: "review",
    updatedAt: "2026-07-28",
  },
  {
    id: "proj-borealis-shop",
    clientId: "client-borealis",
    name: "E-commerce storefront",
    status: "blocked",
    updatedAt: "2026-07-30",
    description: "Waiting on product photography from client.",
  },
  {
    id: "proj-borealis-brand",
    clientId: "client-borealis",
    name: "Brand refresh",
    status: "done",
    updatedAt: "2026-06-15",
  },
  {
    id: "proj-fernwood-site",
    clientId: "client-fernwood",
    name: "Landing page + ordering form",
    status: "planning",
    updatedAt: "2026-08-05",
  },
  {
    id: "proj-fernwood-seo",
    clientId: "client-fernwood",
    name: "Local SEO setup",
    status: "in_progress",
    updatedAt: "2026-08-06",
  },
];
