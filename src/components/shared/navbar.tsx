"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  const getDashboardLink = () => {
    const role = (session?.user as SessionUser | undefined)?.role;
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "TUTOR") return "/dashboard/tutor";
    return "/dashboard/student";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <BookOpen className="h-4 w-4" />
          </div>
          <span>
            Skill<span className="text-indigo-600">Bridge</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/tutors" className="text-muted-foreground hover:text-foreground transition-colors">
            Find Tutors
          </Link>
          {session && (
            <>
              <Link href="/bookings" className="text-muted-foreground hover:text-foreground transition-colors">
                My Bookings
              </Link>
              <Link href={getDashboardLink()} className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {session ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href={getDashboardLink()}>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-indigo-600/20 hover:ring-indigo-600/60 transition-all">
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {getInitials(session.user.name || "U")}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button variant="brand" size="sm" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 flex flex-col gap-3">
          <Link href="/tutors" className="text-sm py-2 hover:text-indigo-600 transition-colors" onClick={() => setMenuOpen(false)}>
            Find Tutors
          </Link>
          {session ? (
            <>
              <Link href="/bookings" className="text-sm py-2 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                My Bookings
              </Link>
              <Link href={getDashboardLink()} className="text-sm py-2 hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard className="inline h-4 w-4 mr-1" />Dashboard
              </Link>
              <button onClick={handleSignOut} className="text-sm text-left py-2 text-red-500 hover:text-red-600">
                <LogOut className="inline h-4 w-4 mr-1" />Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm py-2" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link href="/register" className="text-sm py-2 text-indigo-600 font-medium" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
