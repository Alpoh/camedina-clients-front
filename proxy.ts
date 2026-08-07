import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";
import { homeForRole } from "@/lib/auth-routes";
import { clients } from "@/lib/mock-data/clients";
import { projects } from "@/lib/mock-data/projects";
import { users } from "@/lib/mock-data/users";

// Next.js streams a dynamic route's shell before a deep notFound() call can
// resolve, so the HTTP status can't change from 200 once that's happened
// (see node_modules/next/dist/docs/.../functions/not-found.md). Existence
// and ownership checks for id-based routes run here instead, since proxy
// runs before any response streaming begins — this is what lets a bad id
// or a cross-client lookup produce a real 404 rather than a 200 with a
// 404-shaped body. The DAL/page-level checks stay in place as the actual
// security boundary; this only fixes the status code.
function notFound(request: NextRequest) {
  return NextResponse.rewrite(new URL(`/__404__${request.nextUrl.pathname}`, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal");
  const isLoginRoute = pathname === "/login";

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decrypt(cookie);

  if ((isAdminRoute || isPortalRoute) && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && session) {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  if (isAdminRoute && session && session.role !== "admin") {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  if (isPortalRoute && session && session.role !== "client") {
    return NextResponse.redirect(new URL(homeForRole(session.role), request.url));
  }

  const clientMatch = pathname.match(/^\/admin\/clients\/([^/]+)$/);
  if (clientMatch && !clients.some((c) => c.id === clientMatch[1])) {
    return notFound(request);
  }

  const adminProjectMatch = pathname.match(/^\/admin\/projects\/([^/]+)$/);
  if (
    adminProjectMatch &&
    !projects.some((p) => p.id === adminProjectMatch[1])
  ) {
    return notFound(request);
  }

  const portalProjectMatch = pathname.match(/^\/portal\/projects\/([^/]+)$/);
  if (portalProjectMatch && session) {
    const user = users.find((u) => u.id === session.userId);
    const project = projects.find((p) => p.id === portalProjectMatch[1]);
    if (!project || !user || project.clientId !== user.clientId) {
      return notFound(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
