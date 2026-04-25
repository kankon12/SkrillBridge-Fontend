// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import Link from "next/link";
// import { Calendar, Filter, ExternalLink, XCircle, Loader2, Star, MessageSquare } from "lucide-react";
// import { bookingsApi, reviewsApi } from "@/lib/api";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { formatDate, formatCurrency, getInitials, getBookingStatusColor } from "@/lib/utils";
// import type { Booking, BookingStatus } from "@/types";
// import { toast } from "sonner";

// export default function StudentBookingsPage() {
//   const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
//   const [reviewingId, setReviewingId] = useState<string | null>(null);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["bookings"],
//     queryFn: () => bookingsApi.getAll(),
//   });

//   const cancelMutation = useMutation({
//     mutationFn: (id: string) => bookingsApi.cancel(id, "Cancelled by student"),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });
//       toast.success("Booking cancelled");
//     },
//     onError: (err: unknown) => {
//       const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
//       toast.error(msg || "Failed to cancel booking");
//     },
//   });

//   const reviewMutation = useMutation({
//     mutationFn: ({ bookingId }: { bookingId: string }) =>
//       reviewsApi.create({ bookingId, rating, comment }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["bookings"] });
//       toast.success("Review submitted! ⭐");
//       setReviewingId(null);
//       setRating(5);
//       setComment("");
//     },
//     onError: (err: unknown) => {
//       const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
//       toast.error(msg || "Failed to submit review");
//     },
//   });

  
  
//   const bookings: Booking[] = data?.data?.data || [];
//   const filtered = statusFilter === "ALL" ? bookings : bookings.filter((b) => b.status === statusFilter);

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">My Bookings</h1>
//           <p className="text-muted-foreground mt-1">Manage all your sessions</p>
//         </div>
//         <Button variant="brand" size="sm" asChild>
//           <Link href="/tutors">Book New Session</Link>
//         </Button>
//       </div>

//       <div className="flex items-center gap-2 flex-wrap">
//         <Filter className="h-4 w-4 text-muted-foreground" />
//         <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "ALL")}>
//           <SelectTrigger className="w-40">
//             <SelectValue />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="ALL">All Status</SelectItem>
//             <SelectItem value="CONFIRMED">Confirmed</SelectItem>
//             <SelectItem value="COMPLETED">Completed</SelectItem>
//             <SelectItem value="CANCELLED">Cancelled</SelectItem>
//           </SelectContent>
//         </Select>
//         <span className="text-sm text-muted-foreground">{filtered.length} booking(s)</span>
//       </div>

//       {isLoading ? (
//         <div className="flex items-center justify-center h-40">
//           <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
//         </div>
//       ) : filtered.length === 0 ? (
//         <Card>
//           <CardContent className="py-12 text-center space-y-3">
//             <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
//             <p className="text-muted-foreground">No bookings found</p>
//             <Button variant="brand" size="sm" asChild>
//               <Link href="/tutors">Find a Tutor</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="space-y-3">
//           {filtered.map((booking) => (
//             <Card key={booking.id} className="hover:shadow-sm transition-shadow">
//               <CardContent className="p-5">
//                 <div className="flex items-start gap-4">
//                   <Avatar className="h-12 w-12 shrink-0">
//                     <AvatarImage src={booking.tutor?.user?.image ?? undefined} />
//                     <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
//                       {getInitials(booking.tutor?.user?.name || "T")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 min-w-0 space-y-1">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <p className="font-semibold">{booking.subject}</p>
//                       <Badge className={getBookingStatusColor(booking.status)} variant="outline">
//                         {booking.status}
//                       </Badge>
//                       {booking.review && (
//                         <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-400">★ Reviewed</Badge>
//                       )}
//                     </div>
//                     <p className="text-sm text-muted-foreground">Tutor: {booking.tutor?.user?.name}</p>
//                     <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
//                       <span>📅 {formatDate(booking.scheduledAt)}</span>
//                       <span>⏱ {booking.durationMins} min</span>
//                       <span>💰 {formatCurrency(booking.totalPrice)}</span>
//                     </div>
//                     {booking.notes && <p className="text-xs text-muted-foreground italic">Notes: {booking.notes}</p>}
//                     {booking.cancelReason && <p className="text-xs text-red-500">Reason: {booking.cancelReason}</p>}

//                     {/* Review form */}
//                     {reviewingId === booking.id && (
//                       <div className="mt-3 p-3 rounded-lg border bg-muted/30 space-y-3">
//                         <p className="text-sm font-medium">Rate your session</p>
//                         <div className="flex gap-1">
//                           {[1,2,3,4,5].map((s) => (
//                             <button key={s} type="button" onClick={() => setRating(s)}>
//                               <Star className={`h-6 w-6 transition-colors ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
//                             </button>
//                           ))}
//                         </div>
//                         <Textarea
//                           placeholder="Share your experience (optional)..."
//                           value={comment}
//                           onChange={(e) => setComment(e.target.value)}
//                           rows={2}
//                           className="text-sm"
//                         />
//                         <div className="flex gap-2">
//                           <Button size="sm" variant="brand"
//                             onClick={() => reviewMutation.mutate({ bookingId: booking.id })}
//                             disabled={reviewMutation.isPending}
//                           >
//                             {reviewMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Submit Review"}
//                           </Button>
//                           <Button size="sm" variant="outline" onClick={() => setReviewingId(null)}>Cancel</Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex flex-col gap-2 shrink-0">
//                     {booking.meetingLink && booking.status === "CONFIRMED" && (
//                       <Button size="sm" variant="brand" asChild>
//                         <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
//                           <ExternalLink className="h-3 w-3" /> Join
//                         </a>
//                       </Button>
//                     )}
                  
//                     {booking.status === "CONFIRMED" && new Date(booking.scheduledAt) > new Date() && (
//                       <Button
//                         size="sm" variant="outline"
//                         className="text-red-500 border-red-200 hover:bg-red-50"
//                         onClick={() => cancelMutation.mutate(booking.id)}
//                         disabled={cancelMutation.isPending}
//                       >
//                         {cancelMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
//                         Cancel
//                       </Button>
//                     )}
//                     {booking.status === "COMPLETED" && !booking.review && reviewingId !== booking.id && (
//                       <Button
//                         size="sm" variant="outline"
//                         className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
//                         onClick={() => { setReviewingId(booking.id); setRating(5); setComment(""); }}
//                       >
//                         <MessageSquare className="h-3 w-3" /> Review
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Calendar, Filter, ExternalLink, XCircle, Loader2,
  Star, MessageSquare, CreditCard, Clock,
} from "lucide-react";
import { bookingsApi, reviewsApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate, formatCurrency, getInitials, getBookingStatusColor } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";
import { toast } from "sonner";
import { InvoiceDownloadButton } from "@/components/shared/invoice-download-button";

export default function StudentBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => bookingsApi.getAll(),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id, "Cancelled by student"),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["bookings"] }); toast.success("বুকিং বাতিল হয়েছে।"); },
    onError: (err: any) => toast.error(err.response?.data?.message || "বাতিল করা সম্ভব হয়নি।"),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ bookingId }: { bookingId: string }) => reviewsApi.create({ bookingId, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("রিভিউ দেওয়া হয়েছে! ⭐");
      setReviewingId(null); setRating(5); setComment("");
    },
    onError: (err: any) => toast.error(err.response?.data?.message || "রিভিউ দেওয়া সম্ভব হয়নি।"),
  });

  const bookings: Booking[] = data?.data?.data || [];
  const filtered = statusFilter === "ALL" ? bookings : bookings.filter((b) => b.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">আমার বুকিং</h1>
          <p className="text-muted-foreground mt-1">তোমার সকল সেশন পরিচালনা করো</p>
        </div>
        <Button variant="brand" size="sm" asChild>
          <Link href="/tutors">নতুন বুকিং</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as BookingStatus | "ALL")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">সব</SelectItem>
            <SelectItem value="PENDING">⏳ Pending (পেমেন্ট বাকি)</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">{filtered.length}টি বুকিং</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">কোনো বুকিং পাওয়া যায়নি</p>
            <Button variant="brand" size="sm" asChild><Link href="/tutors">টিউটর খুঁজুন</Link></Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <Card key={booking.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src={booking.tutor?.user?.image ?? undefined} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {getInitials(booking.tutor?.user?.name || "T")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold">{booking.subject}</p>
                      <Badge className={getBookingStatusColor(booking.status)} variant="outline">
                        {booking.status === "PENDING" && "⏳ "}{booking.status}
                      </Badge>
                      {booking.isPaid && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-400">✓ Paid</Badge>
                      )}
                      {booking.review && (
                        <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-400">★ Reviewed</Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground">টিউটর: {booking.tutor?.user?.name}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      <span>📅 {formatDate(booking.scheduledAt)}</span>
                      <span><Clock className="inline h-3 w-3 mr-0.5" />{booking.durationMins} মিনিট</span>
                      <span>💰 {formatCurrency(booking.totalPrice)}</span>
                    </div>

                    {booking.notes && <p className="text-xs text-muted-foreground italic">নোট: {booking.notes}</p>}
                    {booking.cancelReason && <p className="text-xs text-red-500">কারণ: {booking.cancelReason}</p>}

                    {/* PENDING warning */}
                    {booking.status === "PENDING" && !booking.isPaid && (
                      <div className="mt-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5" />পেমেন্ট বাকি আছে। বুকিং এখনও কনফার্ম হয়নি।
                        </p>
                      </div>
                    )}

                    {/* Review form */}
                    {reviewingId === booking.id && (
                      <div className="mt-3 p-3 rounded-lg border bg-muted/30 space-y-3">
                        <p className="text-sm font-medium">সেশন রেট করুন</p>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map((s) => (
                            <button key={s} type="button" onClick={() => setRating(s)}>
                              <Star className={`h-6 w-6 transition-colors ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                            </button>
                          ))}
                        </div>
                        <Textarea placeholder="তোমার অভিজ্ঞতা শেয়ার করো..." value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="text-sm" />
                        <div className="flex gap-2">
                          <Button size="sm" variant="brand" onClick={() => reviewMutation.mutate({ bookingId: booking.id })} disabled={reviewMutation.isPending}>
                            {reviewMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "রিভিউ দিন"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReviewingId(null)}>বাতিল</Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 shrink-0">
                    {booking.meetingLink && booking.status === "CONFIRMED" && (
                      <Button size="sm" variant="brand" asChild>
                        <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" /> যোগ দিন
                        </a>
                      </Button>
                    )}

                    {/* Invoice button — শুধু paid bookings-এ */}
                    {booking.isPaid && (
                      <InvoiceDownloadButton
                        bookingId={booking.id}
                        booking={booking}
                        size="sm"
                        label="Invoice"
                      />
                    )}

                    {/* Cancel */}
                    {(booking.status === "CONFIRMED" || booking.status === "PENDING") &&
                      (booking.status === "PENDING" || new Date(booking.scheduledAt) > new Date()) && (
                      <Button
                        size="sm" variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => cancelMutation.mutate(booking.id)}
                        disabled={cancelMutation.isPending}
                      >
                        {cancelMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                        বাতিল
                      </Button>
                    )}

                    {/* Review */}
                    {booking.status === "COMPLETED" && !booking.review && reviewingId !== booking.id && (
                      <Button
                        size="sm" variant="outline"
                        className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        onClick={() => { setReviewingId(booking.id); setRating(5); setComment(""); }}
                      >
                        <MessageSquare className="h-3 w-3" /> রিভিউ
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}