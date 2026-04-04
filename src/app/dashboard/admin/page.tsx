"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Users, Calendar, DollarSign, TrendingUp, ShieldCheck, Layers, Loader2, ArrowRight, BookOpen } from "lucide-react";
import { adminApi } from "@/lib/api";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getBookingStatusColor } from "@/lib/utils";
import type { Booking } from "@/types";

export default function AdminDashboard() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.getStats(),
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => adminApi.getAllBookings(),
  });

  // Backend returns: { users:{total,students,tutors}, bookings:{total,completed,cancelled,pending}, revenue:{total}, topTutors }
  const stats = statsData?.data?.data;
  const recentBookings: Booking[] = (bookingsData?.data?.data || []).slice(0, 8);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard 🛡️</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Users"   value={stats?.users?.total      || 0} icon={Users}     color="indigo" />
        <StatCard title="Students"      value={stats?.users?.students    || 0} icon={Users}     color="blue"   />
        <StatCard title="Tutors"        value={stats?.users?.tutors      || 0} icon={ShieldCheck} color="green" />
        <StatCard title="Bookings"      value={stats?.bookings?.total    || 0} icon={Calendar}  color="yellow" />
        <StatCard title="Completed"     value={stats?.bookings?.completed|| 0} icon={TrendingUp} color="green" />
        <StatCard title="Revenue"       value={formatCurrency(stats?.revenue?.total || 0)} icon={DollarSign} color="indigo" />
      </div>

      {/* Top tutors */}
      {stats?.topTutors?.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Top Tutors</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topTutors.map((t: { id: string; user: { name: string; image?: string }; category: { name: string }; totalSessions: number; avgRating: number }) => (
                <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-xs">
                    {t.user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.user.name}</p>
                    <p className="text-xs text-muted-foreground">{t.category?.name}</p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{t.totalSessions} sessions</p>
                    <p>★ {t.avgRating.toFixed(1)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: "/dashboard/admin/users",      icon: Users,       label: "Manage Users",   desc: "Ban/unban, change roles" },
          { href: "/dashboard/admin/tutors",     icon: ShieldCheck, label: "Verify Tutors",  desc: "Review tutor profiles" },
          { href: "/dashboard/admin/categories", icon: Layers,      label: "Categories",     desc: "Add & manage subjects" },
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

      {/* Recent bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Bookings</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/admin/bookings" className="gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Student</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Tutor</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Subject</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Amount</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3">{b.student?.name || "—"}</td>
                    <td className="py-2.5 px-3">{b.tutor?.user?.name || "—"}</td>
                    <td className="py-2.5 px-3">{b.subject}</td>
                    <td className="py-2.5 px-3">{formatCurrency(b.totalPrice)}</td>
                    <td className="py-2.5 px-3">
                      <Badge className={getBookingStatusColor(b.status)} variant="outline">{b.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentBookings.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No bookings yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
