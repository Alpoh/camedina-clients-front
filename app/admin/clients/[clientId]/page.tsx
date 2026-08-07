import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import { getClientById } from "@/lib/api/clients";
import { getProjectsByClientId } from "@/lib/api/projects";
import { NavBreadcrumbs } from "@/components/ui/nav-breadcrumbs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/lib/status";

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  await getUser();
  const { clientId } = await params;
  const client = await getClientById(clientId);

  if (!client) notFound();

  const projects = await getProjectsByClientId(client.id);

  return (
    <div className="mx-auto max-w-5xl">
      <NavBreadcrumbs
        items={[
          { label: "admin", href: "/admin" },
          { label: "clients", href: "/admin/clients" },
          { label: client.name },
        ]}
      />
      <h1 className="mt-2 text-xl font-semibold text-foreground">
        {client.name}
      </h1>
      <p className="mt-1 text-sm text-foreground-dim">
        {client.contactEmail} · client since {client.createdAt}
      </p>

      <p className="mt-8 text-xs uppercase tracking-wide text-foreground-dim">
        Projects
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/admin/projects/${project.id}`}>
            <Card className="h-full transition-colors hover:border-accent">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-foreground">{project.name}</p>
                <Badge variant={statusVariant[project.status]}>
                  {statusLabel[project.status]}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-foreground-dim">
                updated {project.updatedAt}
              </p>
            </Card>
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-foreground-dim">No projects yet.</p>
        )}
      </div>
    </div>
  );
}
