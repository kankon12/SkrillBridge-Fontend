import Link from "next/link";
import { ArrowRight, Star, Users, BookOpen, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/shared/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-24 bg-gradient-to-b from-indigo-50/50 to-background dark:from-indigo-950/20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="info" className="px-4 py-1.5 text-xs font-semibold">
            🎓 Trusted by 1,000+ students
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Learn from the{" "}
            <span className="text-indigo-600">best tutors</span>
            <br />around you
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            SkillBridge connects students with verified expert tutors. Book
            one-on-one sessions, track your progress, and achieve your goals.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Button variant="brand" size="lg" asChild>
              <Link href="/register">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/tutors">Browse Tutors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "500+", label: "Verified Tutors" },
            { value: "10,000+", label: "Sessions Completed" },
            { value: "4.9★", label: "Average Rating" },
            { value: "50+", label: "Subjects Covered" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why SkillBridge?</h2>
            <p className="text-muted-foreground">Everything you need to learn and grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Verified Tutors", desc: "All tutors go through a strict verification process so you get only the best." },
              { icon: Zap, title: "Instant Booking", desc: "Book sessions in seconds. Choose time, subject, and your preferred tutor." },
              { icon: Globe, title: "Any Subject", desc: "From mathematics to music, find an expert in any field you need." },
              { icon: Star, title: "Rated & Reviewed", desc: "Make informed decisions based on real student reviews and ratings." },
              { icon: Users, title: "Role-based Access", desc: "Separate dashboards for students, tutors, and admins." },
              { icon: BookOpen, title: "Track Progress", desc: "View your learning history, upcoming sessions, and achievements." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-lg border bg-card p-6 space-y-3 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-indigo-600 text-white">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Ready to start learning?</h2>
          <p className="text-indigo-100">Join thousands of students improving their skills every day.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-indigo-600" asChild>
              <Link href="/register?role=STUDENT">I&apos;m a Student</Link>
            </Button>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50" asChild>
              <Link href="/register?role=TUTOR">I&apos;m a Tutor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© 2026 SkillBridge. Built with Next.js, Better Auth & shadcn/ui.</p>
      </footer>
    </div>
  );
}
