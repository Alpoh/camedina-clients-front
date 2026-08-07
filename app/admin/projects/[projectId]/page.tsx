import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import { getProjectById } from "@/lib/api/projects";
import { getClientById } from "@/lib/api/clients";
import { NavBreadcrumbs } from "@/components/ui/nav-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/lib/status";

export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  await getUser();
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) notFound();

  const client = await getClientById(project.clientId);

  return (
    <div className="mx-auto max-w-3xl">
      <NavBreadcrumbs
        items={[
          { label: "admin", href: "/admin" },
          { label: "projects", href: "/admin/projects" },
          { label: project.name },
        ]}
      />

      <div className="mt-2 flex items-center gap-3">
        <h1 className="text-xl font-semibold text-foreground">
          {project.name}
        </h1>
        <Badge variant={statusVariant[project.status]}>
          {statusLabel[project.status]}
        </Badge>
      </div>

      <p className="mt-1 text-sm text-foreground-dim">
        {client ? `${client.name} · ` : ""}
        updated {project.updatedAt}
      </p>

      {project.description && (
        <p className="mt-6 text-sm text-foreground">{project.description}</p>
      )}
    </div>
  );
}
