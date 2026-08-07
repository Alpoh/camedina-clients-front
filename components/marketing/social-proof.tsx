import { TerminalWindow } from "@/components/ui/terminal-window";
import { Prompt } from "@/components/ui/prompt";

const testimonials = [
  {
    quote:
      "Our new site loads instantly and our booking rate has never been better.",
    name: "Jordan Lee",
    company: "Acme Co",
  },
  {
    quote:
      "They rebuilt our storefront and rebranded us in the same pass. Everything just fits now.",
    name: "Priya Shah",
    company: "Borealis Studio",
  },
  {
    quote: "We finally show up when people search for us locally.",
    name: "Marcus Webb",
    company: "Fernwood Bakery",
  },
];

export function SocialProof() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-wide text-foreground-dim">
          <Prompt glyph="#">clients</Prompt>
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          What they say
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (
            <TerminalWindow key={t.name} className="h-full">
              <p className="text-sm text-foreground-dim">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-xs text-foreground">
                {t.name} <span className="text-foreground-dim">— {t.company}</span>
              </p>
            </TerminalWindow>
          ))}
        </div>
      </div>
    </section>
  );
}
