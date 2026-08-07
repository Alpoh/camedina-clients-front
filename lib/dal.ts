import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { getUserById } from "@/lib/api/auth";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true as const, userId: session.userId, role: session.role };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  const user = await getUserById(session.userId);

  if (!user) {
    redirect("/login");
  }

  return user;
});
