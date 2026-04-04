"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import type { SessionUser } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const redirected = useRef(false);

  useEffect(() => {
    if (isPending) return;
    if (redirected.current) return;

    if (session) {
      redirected.current = true;
      const role = (session.user as SessionUser)?.role;
      if (role === "ADMIN") router.replace("/dashboard/admin");
      else if (role === "TUTOR") router.replace("/dashboard/tutor");
      else router.replace("/dashboard/student");
      return;
    }

    // session null হলে একটু wait করো — cookie এখনো set হচ্ছে হয়তো
    const timer = setTimeout(() => {
      if (!redirected.current) {
        redirected.current = true;
        router.replace("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [session, isPending, router]);

  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
    </div>
  );
}
