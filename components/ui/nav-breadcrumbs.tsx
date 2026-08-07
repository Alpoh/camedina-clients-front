import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Crumb = {
  label: string;
  href?: string;
};

type NavBreadcrumbsProps = {
  base?: string;
  items: Crumb[];
  className?: string;
};

export function NavBreadcrumbs({
  base = "~",
  items,
  className,
}: NavBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1 text-sm text-foreground-dim",
        className,
      )}
    >
      <span className="text-accent">{base}</span>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Fragment key={item.label}>
            <span className="text-border-strong">/</span>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-accent">
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(isLast && "text-foreground")}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
