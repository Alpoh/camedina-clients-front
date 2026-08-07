import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs uppercase tracking-wide",
  {
    variants: {
      variant: {
        neutral: "border-border text-foreground-dim",
        success: "border-success/40 text-success",
        warning: "border-accent-amber/40 text-accent-amber",
        error: "border-error/40 text-error",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
