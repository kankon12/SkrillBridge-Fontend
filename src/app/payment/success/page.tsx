"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { InvoiceDownloadButton } from "@/components/shared/invoice-download-button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const [countdown, setCountdown] = useState(8);
  const [autoRedirect, setAutoRedirect] = useState(true);

  useEffect(() => {
    if (!autoRedirect) return;
    const t = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(t); router.push("/dashboard/student/bookings"); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [router, autoRedirect]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center space-y-6 max-w-md w-full">

          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6">
              <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-green-600">পেমেন্ট সফল! 🎉</h1>
            <p className="text-muted-foreground">তোমার বুকিং নিশ্চিত হয়েছে। টিউটর শীঘ্রই যোগাযোগ করবেন।</p>
          </div>

          {bookingId && (
            <div className="rounded-lg bg-muted p-4 text-left space-y-1">
              <p className="text-xs text-muted-foreground font-medium">বুকিং আইডি</p>
              <p className="text-sm font-mono break-all">{bookingId}</p>
            </div>
          )}

          {autoRedirect && (
            <p className="text-sm text-muted-foreground">
              {countdown} সেকেন্ডে বুকিং পেজে যাচ্ছো...{" "}
              <button className="underline text-indigo-500" onClick={() => setAutoRedirect(false)}>বাতিল করো</button>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="brand" asChild>
              <Link href="/dashboard/student/bookings">আমার বুকিং দেখুন</Link>
            </Button>
            {bookingId && (
              <InvoiceDownloadButton
                bookingId={bookingId}
                size="default"
                label="Invoice Download করুন"
              />
            )}
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/tutors">আরও টিউটর খুঁজুন</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}