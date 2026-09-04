"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schema";

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError("");

    try {
      // Simulate sending reset password link
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSubmittedEmail(values.email);
      setIsSuccess(true);
    } catch {
      setServerError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full text-center">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Forgot Password?
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          No worries! Enter the email address associated with your Hosté admin
          account and we&apos;ll send you a password reset link.
        </p>

        <div className="w-full h-px bg-border/60 my-6" />

        {isSuccess ? (
          <div className="space-y-6 py-2">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Reset Link Sent
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                We have sent password reset instructions to{" "}
                <span className="font-semibold text-foreground">
                  {submittedEmail}
                </span>
                .
              </p>
            </div>

            <div className="flex gap-2 flex-col">
              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all cursor-pointer text-center flex items-center justify-center"
                )}
              >
              Back to Sign In
              </Link>

              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="text-xs text-muted-foreground hover:text-foreground font-medium underline transition-colors cursor-pointer"
              >
                Use another email address
              </button>
            </div>
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

            {/* Email Address */}
            <div className="space-y-1.5">
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

            {/* Actions */}
            <div className="space-y-3 pt-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm sm:text-base shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full h-11 rounded-lg border-border text-foreground hover:bg-muted/50 font-medium text-sm transition-colors flex items-center justify-center"
                )}
              >
                Back to Log in
              </Link>
            </div>
          </form>
        )}

        {/* Check your inbox info card */}
        <div className="mt-8 rounded-xl border border-border/80 bg-muted/20 p-4 text-left flex items-start gap-3">
          <div className="mt-0.5 shrink-0 text-secondary">
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs sm:text-sm font-semibold text-foreground">
              Check your inbox
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We&apos;ll send a password reset link to your email. If you don&apos;t
              see it, check your spam folder.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom outer link */}
      <div className="text-center text-xs sm:text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-secondary hover:underline transition-colors"
        >
          Log in here
        </Link>
      </div>
    </div>
  );
}
