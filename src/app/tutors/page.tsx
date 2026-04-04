// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import { Search, Star, Filter, Loader2, SlidersHorizontal } from "lucide-react";
// import { tutorsApi, categoriesApi } from "@/lib/api";
// import { Navbar } from "@/components/shared/navbar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { getInitials, formatCurrency } from "@/lib/utils";
// import type { TutorProfile, Category } from "@/types";

// export default function TutorsPage() {
//   const [search, setSearch] = useState("");
//   const [categorySlug, setCategorySlug] = useState("all");
//   const [maxRate, setMaxRate] = useState("");

//   const { data: tutorsData, isLoading } = useQuery({
//     queryKey: ["tutors", search, categorySlug, maxRate],
//     queryFn: () =>
//       tutorsApi.getAll({
//         search: search || undefined,
//         category: categorySlug !== "all" ? categorySlug : undefined, // backend expects slug
//         maxPrice: maxRate ? Number(maxRate) : undefined,
//       }),
//   });

//   const { data: catData } = useQuery({
//     queryKey: ["categories"],
//     queryFn: () => categoriesApi.getAll(),
//   });

//   const tutors: TutorProfile[] = tutorsData?.data?.data || [];
//   const categories: Category[] = catData?.data?.data || [];

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 py-10 max-w-6xl">
//         {/* Header */}
//         <div className="mb-8 space-y-2">
//           <h1 className="text-3xl font-bold">Find Your Tutor</h1>
//           <p className="text-muted-foreground">Browse verified tutors across all subjects</p>
//         </div>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-lg border bg-card">
//           <div className="relative flex-1 min-w-48">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search by name or subject..."
//               className="pl-9"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//           <Select value={categorySlug} onValueChange={setCategorySlug}>
//             <SelectTrigger className="w-48">
//               <SelectValue placeholder="All Categories" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map((c) => (
//                 <SelectItem key={c.id} value={c.slug}>  {/* slug — backend expects slug */}
//                   {c.icon} {c.name}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <div className="relative w-40">
//             <Input
//               type="number"
//               placeholder="Max rate (BDT)"
//               value={maxRate}
//               onChange={(e) => setMaxRate(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Results count */}
//         <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
//           <SlidersHorizontal className="h-3.5 w-3.5" />
//           {tutors.length} tutor{tutors.length !== 1 ? "s" : ""} found
//         </p>

//         {/* Grid */}
//         {isLoading ? (
//           <div className="flex items-center justify-center h-64">
//             <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
//           </div>
//         ) : tutors.length === 0 ? (
//           <div className="text-center py-16 text-muted-foreground">
//             <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
//             <p className="text-lg font-medium">No tutors found</p>
//             <p className="text-sm">Try different filters or search terms</p>
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {tutors.map((tutor) => (
//               <TutorCard key={tutor.id} tutor={tutor} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function TutorCard({ tutor }: { tutor: TutorProfile }) {
//   return (
//     <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group">
//       <CardContent className="p-5 space-y-4">
//         {/* Top section */}
//         <div className="flex items-start gap-3">
//           <Avatar className="h-14 w-14 shrink-0 ring-2 ring-border group-hover:ring-indigo-200 transition-all">
//             <AvatarImage src={tutor.user?.image ?? undefined} />
//             <AvatarFallback className="bg-indigo-100 text-indigo-700 text-lg dark:bg-indigo-900/30 dark:text-indigo-400">
//               {getInitials(tutor.user?.name || "T")}
//             </AvatarFallback>
//           </Avatar>
//           <div className="flex-1 min-w-0">
//             <p className="font-semibold truncate">{tutor.user?.name}</p>
//             <p className="text-sm text-muted-foreground truncate">{tutor.headline || "Tutor"}</p>
//             <div className="flex items-center gap-2 mt-1 flex-wrap">
//               <Badge variant="outline" className="text-xs px-2 py-0.5">
//                 {tutor.category?.icon} {tutor.category?.name}
//               </Badge>
//               {tutor.isVerified && (
//                 <Badge variant="success" className="text-xs px-2 py-0.5">✓ Verified</Badge>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats row */}
//         <div className="flex items-center gap-4 text-sm">
//           <div className="flex items-center gap-1">
//             <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
//             <span className="font-medium">{tutor.avgRating.toFixed(1)}</span>
//             <span className="text-muted-foreground">({tutor.totalReviews})</span>
//           </div>
//           <div className="text-muted-foreground">•</div>
//           <div className="text-muted-foreground">{tutor.experience} yrs exp</div>
//           <div className="text-muted-foreground">•</div>
//           <div className="text-muted-foreground">{tutor.totalSessions} sessions</div>
//         </div>

//         {/* Languages */}
//         {tutor.languages?.length > 0 && (
//           <div className="flex gap-1.5 flex-wrap">
//             {tutor.languages.slice(0, 3).map((lang) => (
//               <span key={lang} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
//                 {lang}
//               </span>
//             ))}
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex items-center justify-between pt-2 border-t">
//           <div>
//             <span className="text-lg font-bold text-indigo-600">{formatCurrency(tutor.hourlyRate)}</span>
//             <span className="text-xs text-muted-foreground">/hr</span>
//           </div>
//           <Button variant="brand" size="sm" asChild>
//             <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
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
        category: categorySlug !== "all" ? categorySlug : undefined, // ব্যাকএন্ড slug চায়
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
        <div className="mb-8"><h1 className="text-3xl font-bold">টিউটর খুঁজুন</h1><p className="text-muted-foreground">আপনার প্রয়োজনীয় বিষয় অনুযায়ী সেরা টিউটর বেছে নিন</p></div>

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