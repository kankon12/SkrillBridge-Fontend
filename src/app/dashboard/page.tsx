"use client";

import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const redirected = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (redirected.current) return;

    if (session?.user) {
      redirected.current = true;
      const role = (session.user as SessionUser)?.role;
      if (role === "ADMIN") window.location.replace("/dashboard/admin");
      else if (role === "TUTOR") window.location.replace("/dashboard/tutor");
      else window.location.replace("/dashboard/student");
      return;
    }

    // session নেই — একটু wait করে login এ পাঠাও
    const timer = setTimeout(() => {
      if (!redirected.current) {
        redirected.current = true;
        window.location.replace("/login");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [session, isPending]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-sm text-muted-foreground">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
}