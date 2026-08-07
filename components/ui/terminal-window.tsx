import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TerminalWindowProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function TerminalWindow({
  title,
  children,
  className,
  bodyClassName,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface shadow-[0_0_0_1px_rgba(51,255,102,0.04)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-error/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
        {title ? (
          <span className="ml-2 truncate text-xs text-foreground-dim">
            {title}
          </span>
        ) : null}
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </div>
  );
}
