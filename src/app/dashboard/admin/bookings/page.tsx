"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Filter } from "lucide-react";
import { adminApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatCurrency, getBookingStatusColor } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: () => adminApi.getAllBookings(),
  });

  const bookings: Booking[] = data?.data?.data || [];
  const filtered = bookings
    .filter((b) => statusFilter === "ALL" || b.status === statusFilter)
    .filter((b) =>
      search
        ? b.subject.toLowerCase().includes(search.toLowerCase()) ||
          b.student?.name?.toLowerCase().includes(search.toLowerCase()) ||
          b.tutor?.user?.name?.toLowerCase().includes(search.toLowerCase())
        : true
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <p className="text-muted-foreground mt-1">{bookings.length} total bookings on the platform</p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Input
            placeholder="Search subject, student, tutor..."
            className="w-64 pl-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "ALL")}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} result(s)</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Subject</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Student</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Tutor</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Duration</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Price</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="py-3 px-4 font-medium">{b.subject}</td>
                      <td className="py-3 px-4 text-muted-foreground">{b.student?.name || "—"}</td>
                      <td className="py-3 px-4 text-muted-foreground">{b.tutor?.user?.name || "—"}</td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{formatDate(b.scheduledAt)}</td>
                      <td className="py-3 px-4 text-muted-foreground">{b.durationMins} min</td>
                      <td className="py-3 px-4">{formatCurrency(b.totalPrice)}</td>
                      <td className="py-3 px-4">
                        <Badge className={getBookingStatusColor(b.status)} variant="outline">
                          {b.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No bookings found</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
