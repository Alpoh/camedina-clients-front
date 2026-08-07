import type { ReactNode } from "react";
import Link from "next/link";
import { getUser } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import { Prompt } from "@/components/ui/prompt";
import { Button } from "@/components/ui/button";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/portal" className="text-accent">
            <Prompt glyph="~">portal</Prompt>
          </Link>
        </nav>
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
  );
}
