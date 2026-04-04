"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, ShieldCheck, Star } from "lucide-react";
import { adminApi, tutorsApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, formatCurrency } from "@/lib/utils";
import type { TutorProfile } from "@/types";
import { toast } from "sonner";

export default function AdminTutorsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["all-tutors"],
    queryFn: () => tutorsApi.getAll(),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => adminApi.verifyTutor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-tutors"] });
      toast.success("Tutor verified!");
    },
    onError: () => toast.error("Failed to verify tutor"),
  });

  const tutors: TutorProfile[] = data?.data?.data || [];
  const unverified = tutors.filter((t) => !t.isVerified);
  const verified = tutors.filter((t) => t.isVerified);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Verify Tutors</h1>
        <p className="text-muted-foreground mt-1">
          {unverified.length} pending, {verified.length} verified
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Pending */}
          {unverified.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                Pending Verification ({unverified.length})
              </h2>
              {unverified.map((tutor) => (
                <TutorRow key={tutor.id} tutor={tutor} onVerify={() => verifyMutation.mutate(tutor.id)} isPending={verifyMutation.isPending} />
              ))}
            </div>
          )}

          {/* Verified */}
          <div className="space-y-3">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Verified Tutors ({verified.length})
            </h2>
            {verified.map((tutor) => (
              <TutorRow key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TutorRow({ tutor, onVerify, isPending }: { tutor: TutorProfile; onVerify?: () => void; isPending?: boolean }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={tutor.user?.image ?? undefined} />
            <AvatarFallback className="bg-indigo-100 text-indigo-700">
              {getInitials(tutor.user?.name || "T")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold">{tutor.user?.name}</p>
              {tutor.isVerified ? (
                <Badge variant="success">✓ Verified</Badge>
              ) : (
                <Badge variant="warning">Pending</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{tutor.headline || "No headline"}</p>
            <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
              <span>📚 {tutor.category?.name}</span>
              <span>💰 {formatCurrency(tutor.hourlyRate)}/hr</span>
              <span>🎓 {tutor.experience} yrs exp</span>
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                {tutor.avgRating.toFixed(1)} ({tutor.totalReviews})
              </span>
            </div>
          </div>
          {!tutor.isVerified && onVerify && (
            <Button
              size="sm"
              variant="brand"
              onClick={onVerify}
              disabled={isPending}
              className="shrink-0"
            >
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
              Verify
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
