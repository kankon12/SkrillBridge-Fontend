"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingsApi } from "@/lib/api";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { Booking } from "@/types";

interface Props {
  bookingId: string;
  booking?: Booking;
  size?: "sm" | "default";
  label?: string;
}

function buildInvoiceHTML(b: Booking): string {
  const invoiceNo = `INV-${b.id.slice(-8).toUpperCase()}`;
  const issuedDate = new Date().toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" });

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Invoice ${invoiceNo}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:#1a1a2e;background:#fff;padding:32px}
.wrap{max-width:700px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
.head{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:28px 36px;display:flex;justify-content:space-between;align-items:flex-start}
.brand{font-size:22px;font-weight:700}.brand span{opacity:.75}
.inv-meta{text-align:right}.inv-meta h2{font-size:18px;font-weight:700;text-transform:uppercase;letter-spacing:2px;opacity:.9}
.inv-meta p{font-size:12px;opacity:.7;margin-top:3px}
.paid-bar{background:#f0fdf4;border-bottom:1px solid #bbf7d0;padding:10px 36px;display:flex;align-items:center;gap:8px}
.paid-badge{background:#16a34a;color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:99px;text-transform:uppercase}
.paid-note{font-size:12px;color:#15803d}
.body{padding:32px 36px}
.parties{display:flex;gap:32px;margin-bottom:28px}
.party{flex:1}
.plabel{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:6px}
.pname{font-size:15px;font-weight:600;color:#111827}
.prole{font-size:12px;color:#6b7280;margin-top:2px}
table{width:100%;border-collapse:collapse;margin-bottom:24px}
th,td{padding:9px 13px;text-align:left;border:1px solid #e5e7eb;font-size:13px}
th{background:#f9fafb;color:#374151;font-weight:600;width:38%}
td{color:#1f2937}
.mono{font-family:'Courier New',monospace;font-size:11px;color:#6b7280}
.price-box{background:#f5f3ff;border:1px solid #ddd6fe;border-radius:10px;padding:18px 22px;margin-bottom:24px}
.pr{display:flex;justify-content:space-between;font-size:13px;color:#4b5563;margin-bottom:7px}
.pr:last-child{margin-bottom:0}
hr.dashed{border:none;border-top:1px dashed #c4b5fd;margin:10px 0}
.ptotal{display:flex;justify-content:space-between;font-size:17px;font-weight:700;color:#4f46e5}
.stripe-box{border:1px solid #e5e7eb;border-radius:8px;padding:13px 17px;margin-bottom:24px;background:#fafafa}
.stripe-box h4{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6b7280;margin-bottom:9px}
.sr{display:flex;justify-content:space-between;font-size:12px;margin-bottom:5px}
.sr:last-child{margin-bottom:0}
.sr span:first-child{color:#6b7280}.sr span:last-child{color:#111827;font-weight:500}
.foot{background:#f9fafb;border-top:1px solid #e5e7eb;padding:18px 36px;text-align:center;font-size:11px;color:#9ca3af}
.foot strong{color:#6b7280}
@media print{body{padding:0}.wrap{border:none;border-radius:0}}
</style></head><body>
<div class="wrap">
  <div class="head">
    <div><div class="brand">Skill<span>Bridge</span></div><div style="font-size:12px;opacity:.7;margin-top:3px">Online Tutoring Platform</div></div>
    <div class="inv-meta"><h2>Invoice</h2><p>${invoiceNo}</p><p style="margin-top:5px">Issued: ${issuedDate}</p></div>
  </div>
  <div class="paid-bar">
    <div class="paid-badge">✓ Paid</div>
    <span class="paid-note">Payment received successfully via Stripe</span>
  </div>
  <div class="body">
    <div class="parties">
      <div class="party">
        <div class="plabel">Bill To (Student)</div>
        <div class="pname">${b.student?.name || "N/A"}</div>
        <div class="prole">${b.student?.email || ""}</div>
      </div>
      <div class="party">
        <div class="plabel">Service By (Tutor)</div>
        <div class="pname">${b.tutor?.user?.name || "N/A"}</div>
        <div class="prole">${b.tutor?.category?.name || "Tutor"}</div>
      </div>
    </div>
    <table>
      <tr><th>Booking ID</th><td><span class="mono">${b.id}</span></td></tr>
      <tr><th>Subject</th><td>${b.subject}</td></tr>
      <tr><th>Session Date & Time</th><td>${formatDate(b.scheduledAt)}</td></tr>
      <tr><th>Duration</th><td>${b.durationMins} minutes</td></tr>
      <tr><th>Status</th><td><strong style="color:#16a34a">✓ ${b.status}</strong></td></tr>
      ${b.notes ? `<tr><th>Notes</th><td>${b.notes}</td></tr>` : ""}
    </table>
    <div class="price-box">
      <div class="pr"><span>Hourly Rate</span><span>${formatCurrency(b.tutor?.hourlyRate || 0)} / hr</span></div>
      <div class="pr"><span>Duration</span><span>${b.durationMins} min (${(b.durationMins / 60).toFixed(2)} hr)</span></div>
      <hr class="dashed"/>
      <div class="ptotal"><span>Total Paid</span><span>${formatCurrency(b.totalPrice)}</span></div>
    </div>
    <div class="stripe-box">
      <h4>Payment Details</h4>
      <div class="sr"><span>Payment Method</span><span>💳 Stripe (Card)</span></div>
      <div class="sr"><span>Payment Status</span><span style="color:#16a34a;font-weight:600">✓ Paid</span></div>
      ${b.stripeSessionId ? `<div class="sr"><span>Stripe Session ID</span><span class="mono">${b.stripeSessionId}</span></div>` : ""}
      <div class="sr"><span>Transaction Date</span><span>${new Date(b.updatedAt).toLocaleDateString("en-BD", { year: "numeric", month: "long", day: "numeric" })}</span></div>
    </div>
  </div>
  <div class="foot">
    <p><strong>SkillBridge</strong> — Online Tutoring Platform</p>
    <p style="margin-top:3px">This is a computer-generated invoice. No signature required.</p>
  </div>
</div>
</body></html>`;
}

export function InvoiceDownloadButton({ bookingId, booking: bookingProp, size = "sm", label = "Invoice" }: Props) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      let booking = bookingProp;
      if (!booking) {
        const res = await bookingsApi.getById(bookingId);
        booking = res.data?.data;
      }
      if (!booking) throw new Error("Booking data not found");

      const html = buildInvoiceHTML(booking);
      const win = window.open("", "_blank", "width=820,height=950");
      if (!win) throw new Error("Popup blocked. Please allow popups for this site.");
      win.document.write(html);
      win.document.close();
      win.onload = () => {
        setTimeout(() => {
          win.print();
          win.onafterprint = () => win.close();
        }, 300);
      };
    } catch (err: any) {
      alert(err.message || "Invoice তৈরি করা সম্ভব হয়নি।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size={size} onClick={handleDownload} disabled={loading} className="gap-1.5">
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
      {label}
    </Button>
  );
}