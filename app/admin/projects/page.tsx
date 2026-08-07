import Link from "next/link";
import { getUser } from "@/lib/dal";
import { getProjects } from "@/lib/api/projects";
import { getClients } from "@/lib/api/clients";
import { NavBreadcrumbs } from "@/components/ui/nav-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { statusLabel, statusVariant } from "@/lib/status";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/table";

export default async function AdminProjectsPage() {
  await getUser();
  const [projects, clients] = await Promise.all([
    getProjects(),
    getClients(),
  ]);
  const clientName = (clientId: string) =>
    clients.find((c) => c.id === clientId)?.name ?? "Unknown client";

  return (
    <div className="mx-auto max-w-5xl">
      <NavBreadcrumbs items={[{ label: "admin", href: "/admin" }, { label: "projects" }]} />
      <h1 className="mt-2 text-xl font-semibold text-foreground">Projects</h1>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Project</TableHeaderCell>
            <TableHeaderCell>Client</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Updated</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-accent hover:underline"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell className="text-foreground-dim">
                {clientName(project.clientId)}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[project.status]}>
                  {statusLabel[project.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-foreground-dim">
                {project.updatedAt}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
