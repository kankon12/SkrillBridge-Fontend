import { NextRequest, NextResponse } from "next/server";

// যে রাউটগুলো লগইন ছাড়া অ্যাক্সেস করা যাবে না
const protectedRoutes = ["/dashboard", "/bookings", "/profile", "/settings"];

// যে রাউটগুলো লগইন করা থাকলে আর দেখানোর প্রয়োজন নেই (যেমন: লগইন/রেজিস্ট্রেশন)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const allCookies = request.cookies.getAll();

  /**
   * Better Auth এর সেশন কুকি চেক করার লজিক।
   * এটি ডিফল্ট 'better-auth.', কাস্টম 'skillbridge.' 
   * এবং প্রোডাকশন মোডের '__Secure-' প্রিফিক্স সবগুলোই চেক করবে।
   */
  const sessionCookie = allCookies.find(
    (c) =>
      c.name.startsWith("better-auth.") || 
      c.name.startsWith("skillbridge.") ||
      c.name.startsWith("__Secure-")
  );

  const isAuthenticated = !!sessionCookie;

  // ১. ইউজার যদি লগইন না থাকে এবং প্রোটেক্টেড রাউটে যাওয়ার চেষ্টা করে
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    // ইউজার লগইন করার পর যাতে আগের পেজেই ফিরে যেতে পারে, তাই 'from' প্যারামিটার যোগ করা হয়েছে
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ২. ইউজার যদি লগইন করা থাকে এবং আবার লগইন/রেজিস্টার পেজে যেতে চায়
  if (authRoutes.includes(pathname) && isAuthenticated) {
    // সরাসরি ড্যাশবোর্ডে পাঠিয়ে দেবে
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

/**
 * Matcher কনফিগারেশন:
 * এটি নিশ্চিত করে যে মিডলওয়্যারটি ইমেজ, ফন্ট বা স্ট্যাটিক ফাইলগুলোর জন্য রান করে 
 * পারফরম্যান্স নষ্ট না করে।
 */
export const config = {
  matcher: [
    /*
     * নিচের ফাইলগুলো বাদে সব পাথে মিডলওয়্যার চলবে:
     * - api (API routes)
     * - _next/static (Next.js static files)
     * - _next/image (Next.js image optimization)
     * - favicon.ico, public images, etc.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};