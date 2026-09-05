"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signInSchema, type SignInFormValues } from "../schemas/auth.schema";

export function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: SignInFormValues) => {
    setServerError("");

    try {
      // Simulate authentication request
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Logged in with:", values.email);
      router.push("/");
    } catch {
      setServerError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Sign in to Admin
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your credentials below to continue
        </p>
      </div>

      <div className="w-full h-px bg-border/60 my-6" />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {serverError && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {serverError}
          </div>
        )}

        {/* Email Address */}
        <div className="space-y-1.5 text-left">
          <Label
            htmlFor="email"
            className="text-xs sm:text-sm font-semibold text-foreground"
          >
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@hoste.ng"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            {...register("email")}
            className="h-11 rounded-lg border-input bg-background text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary"
          />
          {errors.email && (
            <p className="text-xs text-destructive font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5 text-left">
          <Label
            htmlFor="password"
            className="text-xs sm:text-sm font-semibold text-foreground"
          >
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              disabled={isSubmitting}
              aria-invalid={!!errors.password}
              {...register("password")}
              className="h-11 rounded-lg border-input bg-background text-sm placeholder:text-muted-foreground/60 pr-10 focus-visible:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive font-medium mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-left pt-0.5">
          <Link
            href="/forgot-password"
            className="text-xs sm:text-sm font-medium text-primary hover:underline transition-colors inline-block"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm sm:text-base shadow-sm transition-all cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In to HOSTÉ Admin"
          )}
        </Button>
      </form>

      {/* Footer info */}
      <div className="border-t border-border/80 mt-8 pt-4">
        <p className="text-xs text-muted-foreground text-center">
          Protected by two-factor authentication · HOSTÉ v2.1
        </p>
      </div>
    </div>
  );
}
