import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import type { User } from "@/lib/types/user";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);

  if (!session?.id) {
    redirect("/login");
  }

  return session;
});

export const getUser = cache(async (): Promise<User> => {
  const session = await verifySession();

  return {
    id: session.id,
    name: session.name,
    email: session.email,
    role: session.role,
    clientId: session.clientId,
  };
});
