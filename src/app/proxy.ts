
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep login and authentication endpoints public.
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("medicare_session")?.value;
  const session = token ? await verifySession(token) : null;

  // Redirect logged-in administrators away from the login page.
  if (pathname === "/login") {
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Protect all other API endpoints.
  if (pathname.startsWith("/api/")) {
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // Protect all other pages.
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
