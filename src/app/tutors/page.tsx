
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, Star, Loader2, SlidersHorizontal } from "lucide-react";
import { tutorsApi, categoriesApi } from "@/lib/api";
import { Navbar } from "@/components/shared/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getInitials, formatCurrency } from "@/lib/utils";
import type { TutorProfile, Category } from "@/types";

export default function TutorsPage() {
  const [search, setSearch] = useState("");
  const [categorySlug, setCategorySlug] = useState("all");
  const [maxRate, setMaxRate] = useState("");

  const { data: tutorsData, isLoading } = useQuery({
    queryKey: ["tutors", search, categorySlug, maxRate],
    queryFn: () =>
      tutorsApi.getAll({
        search: search || undefined,
        category: categorySlug !== "all" ? categorySlug : undefined, 
        maxPrice: maxRate ? Number(maxRate) : undefined,
      }),
  });

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
  });

  const tutors: TutorProfile[] = tutorsData?.data?.data || [];
  const categories: Category[] = catData?.data?.data || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-8"><h1 className="text-3xl font-bold">টিউটর খুঁজুন</h1><p className="text-muted-foreground">Search Your needed Tutor</p></div>

        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-lg border bg-card">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="নাম বা বিষয় লিখে খুঁজুন..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={categorySlug} onValueChange={setCategorySlug}>
            <SelectTrigger className="w-48"><SelectValue placeholder="সব ক্যাটাগরি" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
              {categories.map((c) => (<SelectItem key={c.id} value={c.slug}>{c.icon} {c.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="w-40"><Input type="number" placeholder="সর্বোচ্চ বাজেট (BDT)" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} /></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-indigo-600" /></div>
        ) : tutors.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">কোনো টিউটর পাওয়া যায়নি।</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar><AvatarImage src={tutor.user?.image ?? undefined} /><AvatarFallback>{getInitials(tutor.user?.name)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{tutor.user?.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{tutor.headline}</p>
                      <Badge variant="outline" className="mt-1">{tutor.category?.icon} {tutor.category?.name}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 font-bold text-indigo-600">{formatCurrency(tutor.hourlyRate)}<span className="text-[10px] text-muted-foreground">/ঘণ্টা</span></div>
                    <Button variant="brand" size="sm" asChild><Link href={`/tutors/${tutor.id}`}>বিস্তারিত দেখুন</Link></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}