import type { ReactNode } from "react";
import Link from "next/link";
import { getUser } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import { Prompt } from "@/components/ui/prompt";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "dashboard" },
  { href: "/admin/clients", label: "clients" },
  { href: "/admin/projects", label: "projects" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-border px-4 py-6 sm:block">
        <Link href="/admin" className="text-sm text-accent">
          <Prompt glyph="#">admin</Prompt>
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-2 py-1.5 text-sm text-foreground-dim hover:bg-surface hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:justify-end">
          <Link href="/admin" className="text-sm text-accent sm:hidden">
            <Prompt glyph="#">admin</Prompt>
          </Link>
          <div className="flex items-center gap-3 text-sm text-foreground-dim">
            <span>{user.name}</span>
            <form action={logout}>
              <Button type="submit" variant="ghost">
                logout
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
