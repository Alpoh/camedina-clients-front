import { TerminalWindow } from "@/components/ui/terminal-window";
import { Prompt } from "@/components/ui/prompt";

const services = [
  {
    command: "build --site",
    title: "Web design & development",
    description:
      "Fast, responsive sites built to convert — from landing pages to full storefronts.",
  },
  {
    command: "optimize --seo",
    title: "SEO & local search",
    description:
      "Get found by the people already searching for what you offer.",
  },
  {
    command: "audit --presence",
    title: "Digital strategy",
    description:
      "A clear plan for where your business shows up online, and why.",
  },
  {
    command: "watch --uptime",
    title: "Ongoing maintenance",
    description:
      "Updates, monitoring, and support so your site keeps working after launch.",
  },
];

export function Services() {
  return (
    <section id="services" className="px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-wide text-foreground-dim">
          <Prompt glyph="#">services</Prompt>
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">
          What we do
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <TerminalWindow key={service.command} title={`$ ${service.command}`}>
              <h3 className="text-base font-medium text-foreground">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-dim">
                {service.description}
              </p>
            </TerminalWindow>
          ))}
        </div>
      </div>
    </section>
  );
}
