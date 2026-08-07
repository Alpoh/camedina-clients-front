import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PromptProps = {
  glyph?: string;
  children: ReactNode;
  className?: string;
  glyphClassName?: string;
};

export function Prompt({
  glyph = ">",
  children,
  className,
  glyphClassName,
}: PromptProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("text-accent", glyphClassName)}>{glyph}</span>
      {children}
    </span>
  );
}
