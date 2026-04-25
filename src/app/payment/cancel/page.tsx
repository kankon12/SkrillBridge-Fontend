"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { useMutation } from "@tanstack/react-query";
import { bookingsApi } from "@/lib/api";
import { toast } from "sonner";

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancel(bookingId!, "Payment cancelled by user"),
    onSuccess: () => { toast.success("বুকিং বাতিল করা হয়েছে।"); router.push("/tutors"); },
    onError: () => { router.push("/tutors"); },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center space-y-6 max-w-md w-full">

          <div className="flex justify-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-6">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-red-500">পেমেন্ট বাতিল</h1>
            <p className="text-muted-foreground">পেমেন্ট সম্পন্ন হয়নি। বুকিং কনফার্ম হয়নি।</p>
          </div>

          {bookingId && (
            <div className="rounded-lg bg-muted p-4 text-left">
              <p className="text-xs text-muted-foreground font-medium">বুকিং আইডি</p>
              <p className="text-sm font-mono break-all">{bookingId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="brand" asChild>
              <Link href="/tutors">আবার চেষ্টা করুন</Link>
            </Button>
            {bookingId && (
              <Button
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => cancelMutation.mutate()}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                বুকিং বাতিল করুন
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link href="/dashboard/student/bookings">আমার বুকিং</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
      <CancelContent />
    </Suspense>
  );
}