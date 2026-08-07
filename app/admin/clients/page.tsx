import Link from "next/link";
import { getUser } from "@/lib/dal";
import { getClients } from "@/lib/api/clients";
import { getProjects } from "@/lib/api/projects";
import { NavBreadcrumbs } from "@/components/ui/nav-breadcrumbs";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/ui/table";

export default async function AdminClientsPage() {
  await getUser();
  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects(),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <NavBreadcrumbs items={[{ label: "admin", href: "/admin" }, { label: "clients" }]} />
      <h1 className="mt-2 text-xl font-semibold text-foreground">Clients</h1>

      <Table className="mt-6">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Contact</TableHeaderCell>
            <TableHeaderCell align="right">Projects</TableHeaderCell>
            <TableHeaderCell>Client since</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => {
            const count = projects.filter(
              (p) => p.clientId === client.id,
            ).length;
            return (
              <TableRow key={client.id}>
                <TableCell>
                  <Link
                    href={`/admin/clients/${client.id}`}
                    className="text-accent hover:underline"
                  >
                    {client.name}
                  </Link>
                </TableCell>
                <TableCell className="text-foreground-dim">
                  {client.contactEmail}
                </TableCell>
                <TableCell align="right">{count}</TableCell>
                <TableCell className="text-foreground-dim">
                  {client.createdAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
