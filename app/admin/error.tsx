"use client";

import { TerminalWindow } from "@/components/ui/terminal-window";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/components/ui/prompt";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <TerminalWindow title="error" className="max-w-lg">
      <p className="font-mono text-sm text-error">
        <Prompt glyph="!">{error.message || "Something went wrong."}</Prompt>
      </p>
      <Button variant="ghost" className="mt-4" onClick={reset}>
        retry
      </Button>
    </TerminalWindow>
  );
}
