import Link from "next/link";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { buttonVariants } from "@/components/ui/button";
import { Prompt } from "@/components/ui/prompt";

export function Cta() {
  return (
    <section id="contact" className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <TerminalWindow title="agency@web:~$" className="text-center">
          <p className="font-mono text-sm text-foreground-dim">
            <Prompt glyph="$" className="justify-center">
              ready --to-improve-web-presence
            </Prompt>
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            Let&apos;s get your business online, done right.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-foreground-dim">
            Tell us about your business and we&apos;ll get back to you with a
            free audit of your current web presence.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="mailto:hello@agency.test"
              className={buttonVariants({ variant: "primary" })}
            >
              Get in touch
            </Link>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
