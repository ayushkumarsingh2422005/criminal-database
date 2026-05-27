import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getTokenFromRequest, verifySessionToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/setup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".ico")
  ) {
    return NextResponse.next();
  }

  const isCriminalPhoto =
    pathname.startsWith("/criminals/") &&
    /\.(jpe?g|png|webp)$/i.test(pathname);

  if (isCriminalPhoto) {
    const token = getTokenFromRequest(request);
    const session = token ? await verifySessionToken(token) : null;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  const token = getTokenFromRequest(request);
  const session = token ? await verifySessionToken(token) : null;

  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/search", request.url));
  }

  if (isPublic) {
    return NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.role === "io") {
    if (
      pathname === "/criminals" ||
      pathname.startsWith("/transfer") ||
      pathname.startsWith("/investigation-officers") ||
      pathname.startsWith("/admin")
    ) {
      return NextResponse.redirect(new URL("/search", request.url));
    }
    if (
      pathname.startsWith("/api/admins") ||
      pathname.startsWith("/api/transfers") ||
      pathname.startsWith("/api/investigation-officers")
    ) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
  }

  if (session.role !== "superadmin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/search", request.url));
  }

  if (
    session.role === "admin" &&
    !session.policeStationId &&
    pathname.startsWith("/investigation-officers")
  ) {
    return NextResponse.redirect(new URL("/search", request.url));
  }

  if (
    session.role === "superadmin" &&
    (pathname.startsWith("/transfer") || pathname.startsWith("/api/transfers"))
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Transfer is only for police station admins" },
        { status: 403 }
      );
    }
    return NextResponse.redirect(new URL("/search", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
