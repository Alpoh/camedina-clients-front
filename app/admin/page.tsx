import Link from "next/link";
import { getUser } from "@/lib/dal";
import { getClients } from "@/lib/api/clients";
import { getProjects } from "@/lib/api/projects";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/lib/status";

export default async function AdminHome() {
  const [user, clients, projects] = await Promise.all([
    getUser(),
    getClients(),
    getProjects(),
  ]);

  const activeProjects = projects.filter(
    (p) => p.status !== "done",
  ).length;
  const blockedProjects = projects.filter((p) => p.status === "blocked");

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-foreground-dim">Welcome back, {user.name}.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card title="Clients">
          <p className="text-2xl text-foreground">{clients.length}</p>
        </Card>
        <Card title="Active projects">
          <p className="text-2xl text-foreground">{activeProjects}</p>
        </Card>
        <Card title="Blocked">
          <p className="text-2xl text-foreground">{blockedProjects.length}</p>
        </Card>
      </div>

      {blockedProjects.length > 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-foreground-dim">
            Needs attention
          </p>
          <ul className="mt-3 space-y-2">
            {blockedProjects.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-2.5 text-sm hover:border-accent"
                >
                  <span>{project.name}</span>
                  <Badge variant={statusVariant[project.status]}>
                    {statusLabel[project.status]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
