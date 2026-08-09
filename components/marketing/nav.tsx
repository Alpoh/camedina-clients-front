import Link from "next/link";
import { Prompt } from "@/components/ui/prompt";

const links = [
  { href: "#services", label: "services" },
  { href: "#process", label: "process" },
  { href: "#contact", label: "contact" },
];

export function MarketingNav() {
  return (
    <header className="border-b border-border px-6 py-4">
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="text-sm text-foreground">
          camedina<span className="text-accent">@</span>web
          <span className="text-foreground-dim">:~$</span>
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground-dim hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
        <Link href="/login" className="text-sm hover:text-accent">
          <Prompt glyph="$">login</Prompt>
        </Link>
      </nav>
    </header>
  );
}
