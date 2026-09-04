"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schema";

export function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  // Password criteria checks
  const criteria = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", valid: /[a-z]/.test(passwordValue) },
    { label: "One number", valid: /[0-9]/.test(passwordValue) },
    { label: "One special character", valid: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setServerError("");

    try {
      // Simulate password reset request
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Password reset successfully");
      setIsSuccess(true);
    } catch {
      setServerError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Bar Back Link */}
      <div className="flex justify-end pr-1">
        <Link
          href="/sign-in"
          className="text-xs font-medium text-foreground hover:text-muted-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to log in</span>
        </Link>
      </div>

      <div className="w-full">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Reset Password?
          </h1>
          <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
            Enter your new password below.
            <br />
            Make sure it&apos;s strong and secure.
          </p>
        </div>

        <div className="w-full h-px bg-border/60 my-6" />

        {isSuccess ? (
          <div className="space-y-6 py-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Password Reset Complete
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs">
                Your password has been successfully updated. You can now log in
                with your new password.
              </p>
            </div>

            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-11 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm sm:text-base shadow-sm transition-all cursor-pointer"
              )}
            >
              Sign In with New Password
            </Link>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 text-left"
            noValidate
          >
            {serverError && (
              <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg text-center">
                {serverError}
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-foreground"
              >
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

            {/* Password Criteria Checklist */}
            <div className="space-y-2 py-1">
              <p className="text-xs font-medium text-muted-foreground">
                Password must contain:
              </p>
              <div className="space-y-2">
                {criteria.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.valid ? (
                      <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                    )}
                    <span
                      className={`text-xs ${
                        item.valid
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold text-foreground"
              >
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.confirmPassword}
                  {...register("confirmPassword")}
                  className="h-11 rounded-lg border-input bg-background text-sm placeholder:text-muted-foreground/60 pr-10 focus-visible:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm sm:text-base shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting password...
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
