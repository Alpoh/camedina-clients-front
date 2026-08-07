import { Cursor } from "@/components/ui/cursor";

export default function AdminLoading() {
  return (
    <p className="font-mono text-sm text-foreground-dim">
      loading<Cursor className="ml-1" />
    </p>
  );
}
