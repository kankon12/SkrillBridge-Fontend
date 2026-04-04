import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/bookings", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const allCookies = request.cookies.getAll();

  console.log("ALL COOKIES:", allCookies.map(c => c.name)); // ← debug করার জন্য

  const sessionCookie = allCookies.find(
    (c) =>
      c.name.startsWith("skillbridge.") ||
      c.name.startsWith("better-auth.") ||
      c.name.startsWith("__Secure-skillbridge")
  );

  const isAuthenticated = !!sessionCookie;

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};