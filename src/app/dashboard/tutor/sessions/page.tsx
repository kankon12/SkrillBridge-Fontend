"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Filter, CheckCircle, Loader2 } from "lucide-react";
import { tutorsApi, bookingsApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, formatCurrency, getInitials, getBookingStatusColor } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";
import { toast } from "sonner";

export default function TutorSessionsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tutor-sessions"],
    queryFn: () => tutorsApi.getMySessions(),
  });

  const completeMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutor-sessions"] });
      toast.success("Session marked as completed!");
    },
    onError: () => toast.error("Failed to update session"),
  });

  const bookings: Booking[] = data?.data?.data || [];
  const filtered = statusFilter === "ALL" ? bookings : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Sessions</h1>
        <p className="text-muted-foreground mt-1">Manage all your teaching sessions</p>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "ALL")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length} session(s)</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No sessions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={booking.student?.image ?? undefined} />
                    <AvatarFallback className="bg-green-100 text-green-700 text-sm dark:bg-green-900/30 dark:text-green-400">
                      {getInitials(booking.student?.name || "S")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{booking.subject}</p>
                      <Badge className={getBookingStatusColor(booking.status)} variant="outline">
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Student: {booking.student?.name}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>📅 {formatDate(booking.scheduledAt)}</span>
                      <span>⏱ {booking.durationMins} min</span>
                      <span>💰 {formatCurrency(booking.totalPrice)}</span>
                    </div>
                  </div>
                  {booking.status === "CONFIRMED" && new Date(booking.scheduledAt) < new Date() && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-200 hover:bg-green-50 shrink-0"
                      onClick={() => completeMutation.mutate(booking.id)}
                      disabled={completeMutation.isPending}
                    >
                      {completeMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                      Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}