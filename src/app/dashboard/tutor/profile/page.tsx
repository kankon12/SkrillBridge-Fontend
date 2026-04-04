"use client";

import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { authApi, tutorsApi, categoriesApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Category } from "@/types";

const profileSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  hourlyRate: z.coerce.number().min(1, "Rate must be positive"),
  experience: z.coerce.number().min(0),
  languages: z.string(),
  categoryId: z.string().min(1, "Please select a category"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function TutorProfilePage() {
  const queryClient = useQueryClient();

  // Use authApi.getMe() — it returns user with tutorProfile embedded
  const { data: meData, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.getMe(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const categories: Category[] = categoriesData?.data?.data || [];

  // tutorProfile is embedded in /api/auth/me response
  const myProfile = meData?.data?.data?.tutorProfile;

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      headline: "", bio: "", hourlyRate: 500, experience: 0, languages: "", categoryId: "",
    },
  });

  useEffect(() => {
    if (myProfile) {
      reset({
        headline: myProfile.headline || "",
        bio: myProfile.bio || "",
        hourlyRate: myProfile.hourlyRate,
        experience: myProfile.experience,
        languages: (myProfile.languages || []).join(", "),
        categoryId: myProfile.categoryId,
      });
    }
  }, [myProfile, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProfileForm) =>
      tutorsApi.updateProfile({
        ...data,
        hourlyRate: Number(data.hourlyRate),
        experience: Number(data.experience),
        languages: data.languages.split(",").map((l) => l.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || "Failed to update profile");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tutor Profile</h1>
        <p className="text-muted-foreground mt-1">
          {myProfile ? "Update your public profile" : "Create your tutor profile to start accepting bookings"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>This is what students see when they browse tutors</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
            <div className="space-y-2">
              <Label>Category / Subject Area</Label>
              <Select
                onValueChange={(v) => setValue("categoryId", v)}
                defaultValue={myProfile?.categoryId || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Headline</Label>
              <Input placeholder="e.g. Expert Math Tutor with 5+ years experience" {...register("headline")} />
              {errors.headline && <p className="text-xs text-destructive">{errors.headline.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                placeholder="Tell students about yourself, your teaching style, and experience..."
                rows={5}
                {...register("bio")}
              />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hourly Rate (BDT)</Label>
                <Input type="number" placeholder="500" min={1} {...register("hourlyRate")} />
                {errors.hourlyRate && <p className="text-xs text-destructive">{errors.hourlyRate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" placeholder="3" min={0} max={50} {...register("experience")} />
                {errors.experience && <p className="text-xs text-destructive">{errors.experience.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Languages <span className="text-muted-foreground text-xs">(comma separated)</span></Label>
              <Input placeholder="English, Bengali, Hindi" {...register("languages")} />
            </div>

            <Button variant="brand" type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><Save className="h-4 w-4" /> {myProfile ? "Save Profile" : "Create Profile"}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
