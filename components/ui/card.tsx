import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface p-4",
        className,
      )}
    >
      {title ? (
        <p className="mb-2 text-xs uppercase tracking-wide text-foreground-dim">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}
