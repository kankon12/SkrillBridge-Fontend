"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Calendar, DollarSign, Clock, TrendingUp, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { tutorsApi } from "@/lib/api";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency, getInitials, getBookingStatusColor } from "@/lib/utils";
import type { Booking } from "@/types";

export default function TutorDashboard() {
  const { data: session } = useSession();

  // Tutors use getMySessions — returns THEIR sessions as a tutor
  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ["tutor-sessions"],
    queryFn: () => tutorsApi.getMySessions(),
  });

  const bookings: Booking[] = sessionsData?.data?.data || [];
  const confirmed  = bookings.filter((b) => b.status === "CONFIRMED");
  const completed  = bookings.filter((b) => b.status === "COMPLETED");
  const totalEarned = completed.reduce((sum, b) => sum + b.totalPrice, 0);
  const upcoming   = confirmed
    .filter((b) => new Date(b.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tutor Dashboard 📚</h1>
        <p className="text-muted-foreground mt-1">
          Hello, {session?.user?.name?.split(" ")[0]}! Here&apos;s your teaching overview.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Sessions" value={bookings.length}        icon={Calendar}     color="indigo" />
        <StatCard title="Upcoming"       value={confirmed.length}       icon={Clock}        color="blue"   />
        <StatCard title="Completed"      value={completed.length}       icon={CheckCircle}  color="green"  />
        <StatCard title="Total Earned"   value={formatCurrency(totalEarned)} icon={DollarSign} color="yellow"/>
      </div>

      {/* Upcoming sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/tutor/sessions" className="gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
            </div>
          ) : upcoming.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>No upcoming sessions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={booking.student?.image ?? undefined} />
                    <AvatarFallback className="bg-green-100 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">
                      {getInitials(booking.student?.name || "S")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{booking.subject}</p>
                    <p className="text-xs text-muted-foreground">Student: {booking.student?.name}</p>
                  </div>
                  <div className="text-right shrink-0 space-y-0.5">
                    <p className="text-xs font-medium">{formatDate(booking.scheduledAt)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(booking.totalPrice)}</p>
                  </div>
                  <Badge className={getBookingStatusColor(booking.status)} variant="outline">
                    {booking.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/tutor/profile",      icon: TrendingUp, label: "Update Profile",  desc: "Edit bio, rate & skills"  },
          { href: "/dashboard/tutor/availability", icon: Clock,      label: "Set Availability", desc: "Manage your schedule"     },
          { href: "/dashboard/tutor/sessions",     icon: Calendar,   label: "All Sessions",     desc: "View session history"     },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Card key={href} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={href}><ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
