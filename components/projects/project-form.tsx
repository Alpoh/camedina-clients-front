"use client";

import { useActionState } from "react";
import { createProjectAction } from "@/app/actions/projects";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { statusLabel } from "@/lib/status";

export function ProjectForm({ clientId }: { clientId: string }) {
  const [state, formAction, pending] = useActionState(
    createProjectAction.bind(null, clientId),
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-error">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select id="status" name="status" defaultValue="planning">
          {Object.entries(statusLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        {state?.errors?.status && (
          <p className="mt-1 text-xs text-error">{state.errors.status[0]}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} />
        {state?.errors?.description && (
          <p className="mt-1 text-xs text-error">
            {state.errors.description[0]}
          </p>
        )}
      </div>

      {state?.message && (
        <p className="text-xs text-error">{state.message}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "creating..." : "create project"}
      </Button>
    </form>
  );
}
