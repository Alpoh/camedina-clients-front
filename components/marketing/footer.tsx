import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-xs text-foreground-dim sm:flex-row">
        <span>
          agency<span className="text-accent">@</span>web
          <span> — improving your web presence, one commit at a time.</span>
        </span>
        <Link href="/login" className="hover:text-accent">
          client login
        </Link>
      </div>
    </footer>
  );
}
