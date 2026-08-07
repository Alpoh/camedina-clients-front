import { cn } from "@/lib/utils";

type CursorProps = {
  className?: string;
};

export function Cursor({ className }: CursorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "animate-blink inline-block h-[1em] w-[0.55em] translate-y-[0.1em] bg-cursor align-middle",
        className,
      )}
    />
  );
}
