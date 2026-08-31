import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import { getProjectByClientAndId } from "@/lib/api/projects";
import { NavBreadcrumbs } from "@/components/ui/nav-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/lib/status";
import { formatDate } from "@/lib/format";

export default async function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await getUser();
  const { projectId } = await params;

  if (!user.clientId) notFound();
  const project = await getProjectByClientAndId(user.clientId, projectId);

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <NavBreadcrumbs
        items={[{ label: "portal", href: "/portal" }, { label: project.name }]}
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
        updated {formatDate(project.updatedAt)}
      </p>

      {project.description && (
        <p className="mt-6 text-sm text-foreground">{project.description}</p>
      )}
    </div>
  );
}
