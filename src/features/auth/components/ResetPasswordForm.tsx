"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  verifyResetOtpSchema,
  newPasswordSchema,
  type VerifyResetOtpFormValues,
  type NewPasswordFormValues,
} from "../schemas/auth.schema";
import { useForgotPassword, useResetPassword } from "../hooks/auth.hooks";

/**
 * Custom Mail Illustration matching Screen 2 Design with bottom opacity fade
 */
function MailIllustration({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto flex items-center justify-center", className)}>
      <div className="w-28 h-24 sm:w-32 sm:h-28 relative flex items-center justify-center">
        <svg
          viewBox="0 0 120 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-primary"
        >
          <defs>
            <linearGradient id="mailGradientReset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
              <stop offset="40%" stopColor="currentColor" stopOpacity="0.95" />
              <stop offset="70%" stopColor="currentColor" stopOpacity="0.4" />
              <stop offset="95%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
            <mask id="mailMaskReset">
              <linearGradient id="maskGradReset" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="35%" stopColor="white" stopOpacity="1" />
                <stop offset="65%" stopColor="white" stopOpacity="0.45" />
                <stop offset="95%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <rect width="120" height="100" fill="url(#maskGradReset)" />
            </mask>
          </defs>

          {/* Masked Mail Icon with Smooth Bottom Transparency */}
          <g mask="url(#mailMaskReset)">
            {/* Outer Rounded Envelope */}
            <rect
              x="8"
              y="8"
              width="104"
              height="84"
              rx="18"
              stroke="url(#mailGradientReset)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Inner Folded Flap */}
            <path
              d="M15 16L60 54L105 16"
              stroke="url(#mailGradientReset)"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}


export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialOtp = searchParams.get("otp") || "";

  // If both email and otp are provided, start directly at step 3 (Reset Password), otherwise step 2 (Verify OTP)
  const [step, setStep] = useState<2 | 3>(initialOtp && initialEmail ? 3 : 2);
  const [email] = useState(initialEmail);
  const [otp, setOtp] = useState(initialOtp);
  const [serverError, setServerError] = useState("");
  const [isSuccessComplete, setIsSuccessComplete] = useState(false);

  // Step 2 timer & digits state
  const [digits, setDigits] = useState<string[]>(
    initialOtp
      ? initialOtp.slice(0, 6).split("").concat(Array(Math.max(0, 6 - initialOtp.length)).fill(""))
      : ["", "", "", "", "", ""]
  );
  const [timerSeconds, setTimerSeconds] = useState(119); // 01:59
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3 password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutations
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  // Form Step 2: OTP
  const formStep2 = useForm<VerifyResetOtpFormValues>({
    resolver: zodResolver(verifyResetOtpSchema),
    defaultValues: { otp: initialOtp },
    mode: "onSubmit",
  });

  // Form Step 3: New Password
  const formStep3 = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const passwordValue = formStep3.watch("newPassword") || "";

  // Password criteria checks
  const criteria = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter", valid: /[a-z]/.test(passwordValue) },
    { label: "One number", valid: /[0-9]/.test(passwordValue) },
    {
      label: "One special character",
      valid: /[^A-Za-z0-9]/.test(passwordValue),
    },
  ];

  // Countdown timer for Step 2
  useEffect(() => {
    if (step !== 2 || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 2: Handle OTP Digits change
  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, "");
    const newDigits = [...digits];

    if (cleanVal.length > 1) {
      const pasted = cleanVal.slice(0, 6).split("");
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      const combined = newDigits.join("");
      formStep2.setValue("otp", combined, { shouldValidate: true });
      const nextIdx = Math.min(pasted.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setDigits(newDigits);
    const combined = newDigits.join("");
    formStep2.setValue("otp", combined, { shouldValidate: combined.length === 6 });

    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const newDigits = ["", "", "", "", "", ""];
    pastedData.split("").forEach((char, idx) => {
      newDigits[idx] = char;
    });
    setDigits(newDigits);
    formStep2.setValue("otp", newDigits.join(""), { shouldValidate: true });
    const focusIdx = Math.min(pastedData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  // Step 2: Resend code
  const handleResend = () => {
    if (timerSeconds > 0 || forgotPasswordMutation.isPending || !email) return;
    setServerError("");
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setTimerSeconds(119);
          setDigits(["", "", "", "", "", ""]);
          formStep2.setValue("otp", "");
          inputRefs.current[0]?.focus();
        },
        onError: (error) => {
          setServerError(
            error instanceof Error
              ? error.message
              : "Failed to resend code. Please try again."
          );
        },
      }
    );
  };

  // Step 2: Submit OTP
  const onSubmitStep2 = (values: VerifyResetOtpFormValues) => {
    setServerError("");
    setOtp(values.otp);
    setStep(3);
  };

  // Step 3: Submit New Password
  const onSubmitStep3 = (values: NewPasswordFormValues) => {
    setServerError("");
    resetPasswordMutation.mutate(
      {
        email,
        otp,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          setIsSuccessComplete(true);
        },
        onError: (error) => {
          setServerError(
            error instanceof Error
              ? error.message
              : "Failed to reset password. Please verify your reset code and try again."
          );
        },
      }
    );
  };

  // Success Complete Screen
  if (isSuccessComplete) {
    return (
      <div className="w-full space-y-6 py-4 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Password Reset Complete
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Your password has been successfully updated and all sessions revoked.
            You can now log in with your new password.
          </p>
        </div>

        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full h-11 sm:h-12 flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm sm:text-base shadow-sm transition-all cursor-pointer"
          )}
        >
          Sign In with New Password
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ========================================================================= */}
      {/* SCREEN 2: CHECK YOUR MAIL (OTP VERIFICATION) */}
      {/* ========================================================================= */}
      {step === 2 && (
        <div className="w-full space-y-6 text-center">
          {/* Illustrated Orange Envelope */}
          <div className="pt-2">
            <MailIllustration />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Check your Mail
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
              We&apos;ve sent a 6-digit verification code to your registered email.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={formStep2.handleSubmit(onSubmitStep2)}
            className="space-y-5"
            noValidate
          >
            {serverError && (
              <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {serverError}
              </div>
            )}

            {/* 6 Digit Input Slots */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 py-1">
              {digits.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    aria-label={`Digit ${index + 1}`}
                    className={cn(
                      "w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-muted/30 text-foreground transition-all outline-none",
                      digit
                        ? "border-border bg-card shadow-xs"
                        : "border-border/80 focus:bg-primary/5 focus:ring-1 focus:ring-primary",
                      formStep2.formState.errors.otp && "border-destructive/80"
                    )}
                  />
                  {!digit && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground/60 text-lg">
                      •
                    </span>
                  )}
                </div>
              ))}
            </div>

            {formStep2.formState.errors.otp && (
              <p className="text-xs text-destructive font-medium">
                {formStep2.formState.errors.otp.message}
              </p>
            )}

            {/* Timer & Resend Link */}
            <div className="space-y-2 text-center text-xs sm:text-sm">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium text-foreground">
                  {formatTimer(timerSeconds)}
                </span>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={timerSeconds > 0 || forgotPasswordMutation.isPending || !email}
                  className="font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                disabled={digits.join("").length < 6}
                className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm sm:text-base shadow-sm transition-all cursor-pointer"
              >
                Verify
              </Button>

              <Link
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "w-full h-11 sm:h-12 rounded-xl border-border text-foreground hover:bg-muted/50 font-medium text-sm transition-colors flex items-center justify-center"
                )}
              >
                Back to Log in
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: RESET PASSWORD */}
      {/* ========================================================================= */}
      {step === 3 && (
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

            {/* Form */}
            <form
              onSubmit={formStep3.handleSubmit(onSubmitStep3)}
              className="space-y-4 text-left"
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
                  htmlFor="newPassword"
                  className="text-xs font-normal text-muted-foreground"
                >
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    disabled={resetPasswordMutation.isPending}
                    aria-invalid={!!formStep3.formState.errors.newPassword}
                    {...formStep3.register("newPassword")}
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
                {formStep3.formState.errors.newPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {formStep3.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Password Criteria Checklist */}
              <div className="space-y-2 py-1">
                <p className="text-xs font-normal text-muted-foreground">
                  Password must contain:
                </p>
                <div className="space-y-1.5">
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
                  className="text-xs font-normal text-muted-foreground"
                >
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    disabled={resetPasswordMutation.isPending}
                    aria-invalid={!!formStep3.formState.errors.confirmPassword}
                    {...formStep3.register("confirmPassword")}
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
                {formStep3.formState.errors.confirmPassword && (
                  <p className="text-xs text-destructive font-medium mt-1">
                    {formStep3.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={resetPasswordMutation.isPending}
                  className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm sm:text-base shadow-sm transition-all cursor-pointer"
                >
                  {resetPasswordMutation.isPending ? (
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
          </div>
        </div>
      )}
    </div>
  );
}


