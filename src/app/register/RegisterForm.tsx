"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, Eye, EyeOff, Loader2, GraduationCap, BookMarked } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STUDENT", "TUTOR"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role") as "STUDENT" | "TUTOR") || "STUDENT";

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (result.error) {
        toast.error(result.error.message || "Registration failed");
        return;
      }

      toast.success("Account created! Welcome to SkillBridge 🎉");
      router.replace("/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-background dark:from-indigo-950/20 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span>Skill<span className="text-indigo-600">Bridge</span></span>
          </div>
          <p className="text-sm text-muted-foreground">Create your free account</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Get started</CardTitle>
            <CardDescription>Choose your role and create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["STUDENT", "TUTOR"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setValue("role", role)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                        selectedRole === role
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-border hover:border-indigo-300"
                      )}
                    >
                      {role === "STUDENT" ? (
                        <GraduationCap className={cn("h-6 w-6", selectedRole === role ? "text-indigo-600" : "text-muted-foreground")} />
                      ) : (
                        <BookMarked className={cn("h-6 w-6", selectedRole === role ? "text-indigo-600" : "text-muted-foreground")} />
                      )}
                      <span className={cn("text-sm font-medium", selectedRole === role ? "text-indigo-600" : "text-muted-foreground")}>
                        {role === "STUDENT" ? "Student" : "Tutor"}
                      </span>
                    </button>
                  ))}
                </div>
                <input type="hidden" {...register("role")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" {...register("name")} disabled={isLoading} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} disabled={isLoading} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    {...register("password")}
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              <Button variant="brand" className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}