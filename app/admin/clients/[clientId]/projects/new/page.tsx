import { notFound } from "next/navigation";
import { getUser } from "@/lib/dal";
import { getClientById } from "@/lib/api/clients";
import { NavBreadcrumbs } from "@/components/ui/nav-breadcrumbs";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { ProjectForm } from "@/components/projects/project-form";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  await getUser();
  const { clientId } = await params;
  const client = await getClientById(clientId);

  if (!client) notFound();

  return (
    <div className="mx-auto max-w-sm">
      <NavBreadcrumbs
        items={[
          { label: "admin", href: "/admin" },
          { label: "clients", href: "/admin/clients" },
          { label: client.name, href: `/admin/clients/${client.id}` },
          { label: "new project" },
        ]}
      />
      <h1 className="mt-2 text-xl font-semibold text-foreground">
        New project for {client.name}
      </h1>

      <TerminalWindow
        title={`camedina@web:~/clients/${client.id}/projects/new`}
        className="mt-6"
      >
        <ProjectForm clientId={client.id} />
      </TerminalWindow>
    </div>
  );
}
