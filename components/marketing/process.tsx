import { Prompt } from "@/components/ui/prompt";

const steps = [
  { command: "step-1 --discover", title: "Discover", description: "We learn about your business, your customers, and where your current presence falls short." },
  { command: "step-2 --design", title: "Design & build", description: "We design and build a site that looks sharp and loads fast, on any device." },
  { command: "step-3 --launch", title: "Launch", description: "We ship it, connect your domain, and make sure everything works end to end." },
  { command: "step-4 --grow", title: "Grow", description: "SEO, content, and maintenance to keep your presence improving over time." },
];

export function Process() {
  return (
    <section id="process" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-wide text-foreground-dim">
          <Prompt glyph="#">process</Prompt>
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          How it works
        </h2>

        <ol className="mt-8 space-y-3">
          {steps.map((step) => (
            <li
              key={step.command}
              className="rounded-md border border-border bg-surface px-4 py-3 sm:flex sm:items-baseline sm:gap-4"
            >
              <span className="block font-mono text-sm text-accent sm:w-56 sm:shrink-0">
                $ {step.command}
              </span>
              <span className="block text-sm text-foreground-dim">
                <span className="text-foreground">{step.title}.</span>{" "}
                {step.description}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
