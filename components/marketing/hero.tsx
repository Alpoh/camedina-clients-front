import Link from "next/link";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Cursor } from "@/components/ui/cursor";
import { buttonVariants } from "@/components/ui/button";
import { Prompt } from "@/components/ui/prompt";

export function Hero() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <TerminalWindow title="camedina@web:~$" bodyClassName="p-6 sm:p-8">
          <p className="font-mono text-sm text-foreground-dim">
            <Prompt glyph="$">./improve-web-presence.sh --client=you</Prompt>
          </p>

          <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            <span className="animate-typing">
              We build the web presence your business deserves.
            </span>
            <Cursor className="ml-1" />
          </h1>

          <p className="mt-4 max-w-xl text-base text-foreground-dim">
            Websites, SEO, and digital strategy for businesses that want to
            show up, load fast, and convert visitors into clients.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="#contact" className={buttonVariants({ variant: "primary" })}>
              Request an audit
            </Link>
          </div>
        </TerminalWindow>
      </div>
    </section>
  );
}
