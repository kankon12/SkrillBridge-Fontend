"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Users, Star, Settings,
  BookOpen, LogOut, ShieldCheck, Layers, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { ThemeToggle } from "./theme-toggle";

const studentLinks = [
  { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/student/bookings", label: "My Bookings", icon: Calendar },
  { href: "/tutors", label: "Find Tutors", icon: Users },
];

const tutorLinks = [
  { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/tutor/sessions", label: "Sessions", icon: Calendar },
  { href: "/dashboard/tutor/profile", label: "Profile", icon: Settings },
  { href: "/dashboard/tutor/availability", label: "Availability", icon: UserCheck },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Users", icon: Users },
  { href: "/dashboard/admin/bookings", label: "All Bookings", icon: Calendar },
  { href: "/dashboard/admin/tutors", label: "Verify Tutors", icon: ShieldCheck },
  { href: "/dashboard/admin/categories", label: "Categories", icon: Layers },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const role = (session?.user as SessionUser | undefined)?.role;
  const links =
    role === "ADMIN" ? adminLinks : role === "TUTOR" ? tutorLinks : studentLinks;

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-60 border-r bg-card h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b font-bold text-xl shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <BookOpen className="h-4 w-4" />
        </div>
        <span>Skill<span className="text-indigo-600">Bridge</span></span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom user section */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={session?.user?.image ?? undefined} />
              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                {getInitials(session?.user?.name || "U")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{role}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
