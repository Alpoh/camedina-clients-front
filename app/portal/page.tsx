import Link from "next/link";
import { getUser } from "@/lib/dal";
import { getProjectsByClientId } from "@/lib/api/projects";
import { getClientById } from "@/lib/api/clients";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/lib/status";
import { formatDate } from "@/lib/format";

export default async function PortalHome() {
  const user = await getUser();

  if (!user.clientId) {
    return (
      <p className="text-sm text-foreground-dim">
        No client account is linked to this login yet.
      </p>
    );
  }

  const [client, projects] = await Promise.all([
    getClientById(user.clientId),
    getProjectsByClientId(user.clientId),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-foreground-dim">
        Welcome back, {user.name}
        {client ? ` — ${client.name}` : ""}.
      </p>

      <p className="mt-8 text-xs uppercase tracking-wide text-foreground-dim">
        Your projects
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <Link key={project.id} href={`/portal/projects/${project.id}`}>
            <Card className="h-full transition-colors hover:border-accent">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-foreground">{project.name}</p>
                <Badge variant={statusVariant[project.status]}>
                  {statusLabel[project.status]}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-foreground-dim">
                updated {formatDate(project.updatedAt)}
              </p>
            </Card>
          </Link>
        ))}
        {projects.length === 0 && (
          <p className="text-sm text-foreground-dim">
            No projects yet — check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
