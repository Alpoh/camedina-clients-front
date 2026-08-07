import Link from "next/link";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Prompt } from "@/components/ui/prompt";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <TerminalWindow title="error: 404" className="w-full max-w-md">
        <p className="font-mono text-sm text-error">
          <Prompt glyph="!">command not found: this route</Prompt>
        </p>
        <p className="mt-3 text-sm text-foreground-dim">
          The page you&apos;re looking for doesn&apos;t exist, or you don&apos;t
          have access to it.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-accent hover:underline">
          <Prompt glyph="$">cd ~</Prompt>
        </Link>
      </TerminalWindow>
    </main>
  );
}
