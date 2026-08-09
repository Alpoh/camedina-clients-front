"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/components/ui/prompt";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <TerminalWindow title="camedina@web:~/login" className="w-full max-w-sm">
      <form action={action} className="flex flex-col gap-4">
        <Prompt className="text-foreground-dim">authenticate</Prompt>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          {state?.errors?.email && (
            <p className="mt-1 text-xs text-error">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          {state?.errors?.password && (
            <p className="mt-1 text-xs text-error">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {state?.message && <p className="text-xs text-error">{state.message}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "signing in..." : "sign in"}
        </Button>

        <p className="text-center text-xs text-foreground-dim">
          New client?{" "}
          <Link href="/signup" className="text-accent hover:underline">
            create an account
          </Link>
        </p>
      </form>
    </TerminalWindow>
  );
}
