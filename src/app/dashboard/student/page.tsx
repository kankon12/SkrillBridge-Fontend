"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Calendar, Users, Star, BookOpen, ArrowRight, Clock, CheckCircle, XCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { bookingsApi } from "@/lib/api";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, formatCurrency, getInitials, getBookingStatusColor } from "@/lib/utils";
import type { Booking } from "@/types";

export default function StudentDashboard() {
  const { data: session } = useSession();

  const { data: bookingsData } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingsApi.getAll(),
  });

  const bookings: Booking[] = bookingsData?.data?.data || [];
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");
  const upcoming = confirmed
    .filter((b) => new Date(b.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value={bookings.length} icon={Calendar} color="indigo" />
        <StatCard title="Upcoming" value={confirmed.length} icon={Clock} color="blue" />
        <StatCard title="Completed" value={completed.length} icon={CheckCircle} color="green" />
        <StatCard title="Cancelled" value={cancelled.length} icon={XCircle} color="red" />
      </div>

      {/* Upcoming sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/student/bookings" className="gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No upcoming sessions</p>
              <Button variant="brand" size="sm" asChild>
                <Link href="/tutors">Find a Tutor</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={booking.tutor?.user?.image ?? undefined} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs dark:bg-indigo-900/30 dark:text-indigo-400">
                      {getInitials(booking.tutor?.user?.name || "T")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{booking.subject}</p>
                    <p className="text-xs text-muted-foreground">with {booking.tutor?.user?.name}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium">{formatDate(booking.scheduledAt)}</p>
                    <p className="text-xs text-muted-foreground">{booking.durationMins} min</p>
                  </div>
                  <Badge className={getBookingStatusColor(booking.status)}>{booking.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Find Tutors</p>
              <p className="text-sm text-muted-foreground">Browse verified experts</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/tutors"><ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-100 transition-colors">
              <Star className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">My Bookings</p>
              <p className="text-sm text-muted-foreground">View all sessions</p>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/student/bookings"><ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
