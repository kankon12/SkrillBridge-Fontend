import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/bookings", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const allCookies = request.cookies.getAll();

  const sessionCookie = allCookies.find(
    (c) =>
      c.name === "__Secure-skillbridge.session_token" ||
      c.name === "skillbridge.session_token" ||
      c.name.startsWith("skillbridge.") ||
      c.name.startsWith("__Secure-skillbridge.") ||
      c.name.startsWith("better-auth.") ||
      c.name.startsWith("__Secure-better-auth.")
  );

  const isAuthenticated = !!sessionCookie;

  // Protected route + not logged in → login এ পাঠাও
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in + login/register page → dashboard এ পাঠাও
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