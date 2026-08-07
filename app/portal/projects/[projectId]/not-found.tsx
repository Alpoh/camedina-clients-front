import Link from "next/link";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Prompt } from "@/components/ui/prompt";

export default function ProjectNotFound() {
  return (
    <TerminalWindow title="error: 404" className="max-w-md">
      <p className="font-mono text-sm text-error">
        <Prompt glyph="!">project not found</Prompt>
      </p>
      <p className="mt-3 text-sm text-foreground-dim">
        This project doesn&apos;t exist, or isn&apos;t linked to your account.
      </p>
      <Link href="/portal" className="mt-6 inline-block text-sm text-accent hover:underline">
        <Prompt glyph="$">cd ~/portal</Prompt>
      </Link>
    </TerminalWindow>
  );
}
