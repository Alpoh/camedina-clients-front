"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/app/actions/auth";
import { TerminalWindow } from "@/components/ui/terminal-window";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/components/ui/prompt";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <TerminalWindow title="camedina@web:~/signup" className="w-full max-w-sm">
      <form action={action} className="flex flex-col gap-4">
        <Prompt className="text-foreground-dim">create account</Prompt>

        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" autoComplete="name" required />
          {state?.errors?.name && (
            <p className="mt-1 text-xs text-error">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <Label htmlFor="company">Business name</Label>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            required
          />
          {state?.errors?.company && (
            <p className="mt-1 text-xs text-error">
              {state.errors.company[0]}
            </p>
          )}
        </div>

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
            autoComplete="new-password"
            required
          />
          {state?.errors?.password && (
            <p className="mt-1 text-xs text-error">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {state?.message && (
          <p className="text-xs text-error">{state.message}</p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "creating account..." : "create account"}
        </Button>

        <p className="text-center text-xs text-foreground-dim">
          Already have an account?{" "}
          <Link href="/login" className="text-accent hover:underline">
            sign in
          </Link>
        </p>
      </form>
    </TerminalWindow>
  );
}
