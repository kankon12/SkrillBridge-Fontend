


// "use client";

// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { useParams, useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import {
//   Star, Clock, BookOpen, Languages, Calendar,
//   CheckCircle, Loader2, ArrowLeft, MessageSquare, ChevronRight
// } from "lucide-react";
// import Link from "next/link";
// import { tutorsApi, bookingsApi } from "@/lib/api";
// import { useSession } from "@/lib/auth-client";
// import { Navbar } from "@/components/shared/navbar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { getInitials, formatCurrency, DAY_NAMES } from "@/lib/utils";
// import type { TutorProfile, Review } from "@/types";
// import { toast } from "sonner";

// const bookingSchema = z.object({
//   subject: z.string().min(2, "বিষয় উল্লেখ করা প্রয়োজন"),
//   notes: z.string().optional(),
//   scheduledAt: z.string().min(1, "তারিখ ও সময় নির্বাচন করুন"),
//   durationMins: z.coerce.number().min(30).max(240),
// });

// type BookingForm = z.infer<typeof bookingSchema>;

// export default function TutorDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { data: session } = useSession();
//   const [showBookingForm, setShowBookingForm] = useState(false);

//   const { data, isLoading } = useQuery({
//     queryKey: ["tutor", params.id],
//     queryFn: () => tutorsApi.getById(params.id as string),
//   });

//   const tutor: TutorProfile = data?.data?.data;
//   const reviews: Review[] = tutor?.reviews || [];

//   const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingForm>({
//     resolver: zodResolver(bookingSchema),
//     defaultValues: { durationMins: 60 },
//   });

//   const durationMins = watch("durationMins");
//   const estimatedPrice = tutor ? (tutor.hourlyRate * (durationMins / 60)) : 0;

//   const bookingMutation = useMutation({
//     mutationFn: (formData: BookingForm) => {
//       // লোকাল টাইমকে ISO 8601 ফরম্যাটে রূপান্তর (ব্যাকএন্ডের চাহিদা অনুযায়ী)
//       const scheduledAt = new Date(formData.scheduledAt).toISOString();
//       return bookingsApi.create({ 
//         ...formData, 
//         scheduledAt, 
//         tutorId: tutor.id 
//       });
//     },
//     onSuccess: () => {
//       toast.success("সেশন বুকিং সফল হয়েছে! 🎉");
//       router.push("/dashboard/student/bookings");
//     },
//     onError: (err: any) => {
//       const msg = err.response?.data?.message || "বুকিং করা সম্ভব হয়নি। আবার চেষ্টা করুন।";
//       toast.error(msg);
//     },
//   });

//   if (isLoading) return <div className="min-h-screen"><Navbar /><div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div></div>;
//   if (!tutor) return <div className="text-center py-20">টিউটর পাওয়া যায়নি।</div>;

//   const activeAvailability = tutor.availability?.filter((a) => a.isActive) || [];

//   return (
//     <div className="min-h-screen bg-background pb-20">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8 max-w-5xl">
//         <Button variant="ghost" size="sm" className="mb-6 gap-1" asChild>
//           <Link href="/tutors"><ArrowLeft className="h-4 w-4" />সব টিউটর</Link>
//         </Button>

//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">
//             <Card>
//               <CardContent className="p-6 flex items-start gap-5">
//                 <Avatar className="h-20 w-20 ring-4 ring-indigo-100 dark:ring-indigo-900/30">
//                   <AvatarImage src={tutor.user?.image ?? undefined} />
//                   <AvatarFallback className="text-2xl">{getInitials(tutor.user?.name)}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <h1 className="text-2xl font-bold">{tutor.user?.name}</h1>
//                     {tutor.isVerified && <Badge className="bg-green-500">✓ ভেরিফাইড</Badge>}
//                   </div>
//                   <p className="text-muted-foreground">{tutor.headline}</p>
//                   <div className="flex items-center gap-4 mt-3 text-sm">
//                     <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{tutor.avgRating.toFixed(1)} ({tutor.totalReviews})</div>
//                     <div className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />{tutor.experience} বছর অভিজ্ঞতা</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card><CardHeader><CardTitle className="text-base">বায়ো</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground leading-relaxed">{tutor.bio}</p></CardContent></Card>
//           </div>

//           <div className="space-y-4">
//             <Card className="sticky top-20">
//               <CardContent className="p-5 space-y-4">
//                 <div className="text-center">
//                   <span className="text-3xl font-bold text-indigo-600">{formatCurrency(tutor.hourlyRate)}</span>
//                   <span className="text-muted-foreground text-sm"> / ঘণ্টা</span>
//                 </div>

//                 {!showBookingForm ? (
//                   <Button variant="brand" className="w-full" onClick={() => session ? setShowBookingForm(true) : router.push("/login")}>
//                     বুক করুন <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 ) : (
//                   <form onSubmit={handleSubmit((d) => bookingMutation.mutate(d))} className="space-y-4">
//                     <div className="space-y-1.5"><Label>বিষয়</Label><Input placeholder="উদা: গণিত" {...register("subject")} /></div>
//                     <div className="space-y-1.5"><Label>তারিখ ও সময়</Label><Input type="datetime-local" {...register("scheduledAt")} /></div>
//                     <div className="space-y-1.5"><Label>সময়সীমা (মিনিট)</Label><Input type="number" {...register("durationMins")} /></div>
//                     <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
//                       <span className="text-sm">আনুমানিক খরচ</span><span className="font-bold text-indigo-600">{formatCurrency(estimatedPrice)}</span>
//                     </div>
//                     <Button variant="brand" className="w-full" type="submit" disabled={bookingMutation.isPending}>
//                       {bookingMutation.isPending ? "বুকিং হচ্ছে..." : "বুকিং নিশ্চিত করুন"}
//                     </Button>
//                     <Button type="button" variant="ghost" className="w-full text-xs" onClick={() => setShowBookingForm(false)}>বাতিল করুন</Button>
//                   </form>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Star, Clock, BookOpen, Languages, Calendar,
  Loader2, ArrowLeft, MessageSquare, ChevronRight, CreditCard,
} from "lucide-react";
import Link from "next/link";
import { tutorsApi, bookingsApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/shared/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatCurrency, DAY_NAMES } from "@/lib/utils";
import type { TutorProfile, Review } from "@/types";
import { toast } from "sonner";

const bookingSchema = z.object({
  subject: z.string().min(2, "বিষয় উল্লেখ করা প্রয়োজন"),
  notes: z.string().optional(),
  scheduledAt: z.string().min(1, "তারিখ ও সময় নির্বাচন করুন"),
  durationMins: z.coerce.number().min(30).max(240),
});

type BookingForm = z.infer<typeof bookingSchema>;

export default function TutorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [showBookingForm, setShowBookingForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["tutor", params.id],
    queryFn: () => tutorsApi.getById(params.id as string),
  });

  const tutor: TutorProfile = data?.data?.data;
  const reviews: Review[] = tutor?.reviews || [];

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { durationMins: 60 },
  });

  const durationMins = watch("durationMins");
  const estimatedPrice = tutor ? tutor.hourlyRate * (durationMins / 60) : 0;

  const bookingMutation = useMutation({
    mutationFn: (formData: BookingForm) => {
      const scheduledAt = new Date(formData.scheduledAt).toISOString();
      return bookingsApi.create({ ...formData, scheduledAt, tutorId: tutor.id });
    },
    onSuccess: (res) => {
      const checkoutUrl = res.data?.data?.checkoutUrl;
      if (checkoutUrl) {
        toast.success("বুকিং তৈরি হয়েছে! পেমেন্ট পেজে যাচ্ছো...");
        // Stripe Checkout-এ redirect
        window.location.href = checkoutUrl;
      } else {
        toast.error("Checkout URL পাওয়া যায়নি। আবার চেষ্টা করুন।");
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "বুকিং করা সম্ভব হয়নি। আবার চেষ্টা করুন।";
      toast.error(msg);
    },
  });

  if (isLoading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    </div>
  );

  if (!tutor) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">টিউটর পাওয়া যায়নি।</p>
        <Button variant="brand" className="mt-4" asChild>
          <Link href="/tutors">সব টিউটর</Link>
        </Button>
      </div>
    </div>
  );

  const activeAvailability = tutor.availability?.filter((a) => a.isActive) || [];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" size="sm" className="mb-6 gap-1" asChild>
          <Link href="/tutors"><ArrowLeft className="h-4 w-4" />সব টিউটর</Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left: Tutor Info ── */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <Avatar className="h-20 w-20 shrink-0 ring-4 ring-indigo-100 dark:ring-indigo-900/30">
                    <AvatarImage src={tutor.user?.image ?? undefined} />
                    <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-700">
                      {getInitials(tutor.user?.name || "T")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-2xl font-bold">{tutor.user?.name}</h1>
                      {tutor.isVerified && <Badge className="bg-green-500 text-white">✓ ভেরিফাইড</Badge>}
                    </div>
                    <p className="text-muted-foreground">{tutor.headline}</p>
                    <div className="flex items-center gap-4 flex-wrap text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{tutor.avgRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({tutor.totalReviews} রিভিউ)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />{tutor.experience} বছর অভিজ্ঞতা
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {tutor.bio && (
              <Card>
                <CardHeader><CardTitle className="text-base">পরিচিতি</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tutor.bio}</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader><CardTitle className="text-base">বিস্তারিত</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">ক্যাটাগরি</p>
                    <p className="text-sm font-medium">{tutor.category?.icon} {tutor.category?.name}</p>
                  </div>
                </div>
                {tutor.languages?.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <Languages className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">ভাষা</p>
                      <p className="text-sm font-medium">{tutor.languages.join(", ")}</p>
                    </div>
                  </div>
                )}
                {activeAvailability.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">উপলব্ধ দিন</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {activeAvailability.map((a) => (
                          <span key={a.id} className="text-xs bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                            {DAY_NAMES[a.dayOfWeek]} {a.startTime}–{a.endTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />রিভিউ ({reviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">এখনও কোনো রিভিউ নেই</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="space-y-1.5 pb-4 border-b last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{review.student?.name}</p>
                          <div className="flex">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Right: Booking Sidebar ── */}
          <div className="space-y-4">
            <Card className="sticky top-20">
              <CardContent className="p-5 space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-indigo-600">{formatCurrency(tutor.hourlyRate)}</span>
                  <span className="text-muted-foreground text-sm"> / ঘণ্টা</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Stripe দিয়ে নিরাপদ পেমেন্ট</span>
                </div>

                {!showBookingForm ? (
                  <Button
                    variant="brand"
                    className="w-full"
                    onClick={() => {
                      if (!session) {
                        toast.error("বুকিং করতে প্রথমে সাইন ইন করুন");
                        router.push("/login");
                        return;
                      }
                      setShowBookingForm(true);
                    }}
                  >
                    বুক করুন <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <form onSubmit={handleSubmit((d) => bookingMutation.mutate(d))} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label>বিষয়</Label>
                      <Input placeholder="উদা: গণিত, Physics" {...register("subject")} />
                      {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>তারিখ ও সময়</Label>
                      <Input type="datetime-local" {...register("scheduledAt")} />
                      {errors.scheduledAt && <p className="text-xs text-destructive">{errors.scheduledAt.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label>সময়সীমা (মিনিট)</Label>
                      <Input type="number" placeholder="60" min={30} max={240} step={30} {...register("durationMins")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>নোট (ঐচ্ছিক)</Label>
                      <Textarea placeholder="কোন বিষয়গুলো পড়তে চাও..." rows={2} {...register("notes")} />
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-3">
                      <span className="text-sm text-muted-foreground">আনুমানিক খরচ</span>
                      <span className="font-bold text-indigo-600">{formatCurrency(estimatedPrice)}</span>
                    </div>

                    <Button variant="brand" className="w-full gap-2" type="submit" disabled={bookingMutation.isPending}>
                      {bookingMutation.isPending ? (
                        <><Loader2 className="h-4 w-4 animate-spin" />প্রক্রিয়া চলছে...</>
                      ) : (
                        <><CreditCard className="h-4 w-4" />পেমেন্টে যান</>
                      )}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full text-sm" onClick={() => setShowBookingForm(false)}>
                      বাতিল করুন
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}