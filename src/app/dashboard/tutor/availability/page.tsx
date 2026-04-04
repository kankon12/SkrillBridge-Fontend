"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Save, Loader2 } from "lucide-react";
import { tutorsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, DAY_NAMES } from "@/lib/utils";
import { toast } from "sonner";

interface DaySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean; // local UI state only — NOT sent to backend
}

const defaultSlots: DaySlot[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  startTime: "09:00",
  endTime: "17:00",
  enabled: i >= 1 && i <= 5, // Mon-Fri default
}));

export default function TutorAvailabilityPage() {
  const [slots, setSlots] = useState<DaySlot[]>(defaultSlots);

  const mutation = useMutation({
    mutationFn: () => {
      // Send only ENABLED slots — backend schema: { slots: [{dayOfWeek, startTime, endTime}] }
      const activeSlots = slots
        .filter((s) => s.enabled)
        .map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }));
      return tutorsApi.updateAvailability(activeSlots);
    },
    onSuccess: () => toast.success("Availability updated!"),
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to update. Create your tutor profile first.");
    },
  });

  const toggle = (dayOfWeek: number) =>
    setSlots((prev) => prev.map((s) => s.dayOfWeek === dayOfWeek ? { ...s, enabled: !s.enabled } : s));

  const updateTime = (dayOfWeek: number, field: "startTime" | "endTime", value: string) =>
    setSlots((prev) => prev.map((s) => s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s));

  const activeCount = slots.filter((s) => s.enabled).length;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Availability</h1>
        <p className="text-muted-foreground mt-1">Set when you&apos;re available to teach</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Toggle days on/off, then set your hours. Only active days are saved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {slots.map((slot) => (
            <div
              key={slot.dayOfWeek}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border transition-all",
                slot.enabled
                  ? "bg-indigo-50/50 border-indigo-200 dark:bg-indigo-900/10 dark:border-indigo-800"
                  : "opacity-60 bg-muted/20"
              )}
            >
              {/* Toggle switch */}
              <button
                type="button"
                onClick={() => toggle(slot.dayOfWeek)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors",
                  slot.enabled ? "bg-indigo-600" : "bg-muted-foreground/30"
                )}
              >
                <span className={cn(
                  "pointer-events-none mt-0.5 ml-0.5 inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform",
                  slot.enabled ? "translate-x-5" : "translate-x-0"
                )} />
              </button>

              <span className="w-24 font-medium text-sm">{DAY_NAMES[slot.dayOfWeek]}</span>

              {slot.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateTime(slot.dayOfWeek, "startTime", e.target.value)}
                    className="h-8 w-32 text-sm"
                  />
                  <span className="text-muted-foreground text-sm">to</span>
                  <Input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateTime(slot.dayOfWeek, "endTime", e.target.value)}
                    className="h-8 w-32 text-sm"
                  />
                </div>
              ) : (
                <span className="text-sm text-muted-foreground flex-1">Unavailable</span>
              )}
            </div>
          ))}

          <p className="text-xs text-muted-foreground pt-1">
            {activeCount} day{activeCount !== 1 ? "s" : ""} selected
          </p>

          <Button
            variant="brand"
            className="w-full"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || activeCount === 0}
          >
            {mutation.isPending
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              : <><Save className="h-4 w-4" /> Save Availability</>
            }
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
