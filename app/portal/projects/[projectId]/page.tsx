import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import { getProjectById } from "@/lib/api/projects";
import { NavBreadcrumbs } from "@/components/ui/nav-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/lib/status";

export default async function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await getUser();
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  // Ownership check happens here, not just via the URL — a project that
  // exists but belongs to another client must 404 the same as one that
  // doesn't exist at all.
  if (!project || project.clientId !== user.clientId) notFound();

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
        updated {project.updatedAt}
      </p>

      {project.description && (
        <p className="mt-6 text-sm text-foreground">{project.description}</p>
      )}
    </div>
  );
}
