import Link from "next/link";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Prompt } from "@/components/ui/prompt";

export default function ClientNotFound() {
  return (
    <TerminalWindow title="error: 404" className="max-w-md">
      <p className="font-mono text-sm text-error">
        <Prompt glyph="!">client not found</Prompt>
      </p>
      <Link href="/admin/clients" className="mt-6 inline-block text-sm text-accent hover:underline">
        <Prompt glyph="$">cd ~/admin/clients</Prompt>
      </Link>
    </TerminalWindow>
  );
}
