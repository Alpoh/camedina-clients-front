import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { homeForRole } from "@/lib/auth-routes";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal");
  const isPublicAuthRoute = pathname === "/login" || pathname === "/signup";

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);

  if ((isAdminRoute || isPortalRoute) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicAuthRoute && session) {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  if (isAdminRoute && session && session.role !== "admin") {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  if (isPortalRoute && session && session.role !== "client") {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
