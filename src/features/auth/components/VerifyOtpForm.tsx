"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { otpSchema, type OtpFormValues } from "../schemas/auth.schema";

interface VerifyOtpFormProps {
  email?: string;
}

export function VerifyOtpForm({ email = "adm***@hoste.ng" }: VerifyOtpFormProps) {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [serverError, setServerError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [timeLeft, setTimeLeft] = useState(572); // ~09:32 in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
  });

  // Countdown timer for expiry
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, "");

    const newDigits = [...digits];

    if (cleanVal.length > 1) {
      // Pasted multiple digits
      const pasted = cleanVal.slice(0, 6).split("");
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      const combined = newDigits.join("");
      setValue("otp", combined, { shouldValidate: true });

      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setDigits(newDigits);
    const combined = newDigits.join("");
    setValue("otp", combined, { shouldValidate: combined.length === 6 });

    // Move to next input if filled
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
    setValue("otp", newDigits.join(""), { shouldValidate: true });

    const focusIdx = Math.min(pastedData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(60);
    setTimeLeft(600);
    setDigits(["", "", "", "", "", ""]);
    setValue("otp", "");
    inputRefs.current[0]?.focus();
  };

  const onSubmit = async (values: OtpFormValues) => {
    setServerError("");

    try {
      // Simulate verification request
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("Verified OTP:", values.otp);
      router.push("/");
    } catch {
      setServerError("Invalid verification code. Please try again.");
    }
  };

  return (
    <div className="w-full text-center">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        Enter verification code
      </h1>
      <p className="text-xs text-muted-foreground mt-2">
        Sent to {email} · Expires in 10 minutes
      </p>

      <div className="w-full h-px bg-border/60 my-6" />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {serverError && (
          <div className="p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {serverError}
          </div>
        )}

        {/* 6 Digit Input Slots */}
        <div className="flex items-center justify-center gap-3 my-4">
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
                disabled={isSubmitting}
                aria-label={`Digit ${index + 1}`}
                className={cn(
                  "w-12 h-14 text-center text-xl font-bold rounded-xl border bg-muted/30 text-foreground transition-all outline-none",
                  digit
                    ? "border-border bg-card shadow-xs"
                    : "border-border/80 focus:bg-primary/5 focus:ring-1 focus:ring-primary",
                  errors.otp && "border-destructive/80"
                )}
              />
              {!digit && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground/50 text-xl">
                  •
                </span>
              )}
            </div>
          ))}
        </div>

        {errors.otp && (
          <p className="text-xs text-destructive font-medium">
            {errors.otp.message}
          </p>
        )}

        {/* Resend OTP */}
        <div className="flex items-center justify-between text-xs sm:text-sm px-1">
          <span className="text-muted-foreground">Didn&apos;t receive a code?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0 || isSubmitting}
            className="font-semibold text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : "Resend OTP"}
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {/* Verify Button */}
          <Button
            type="submit"
            disabled={isSubmitting || digits.join("").length < 6}
            className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm sm:text-base shadow-sm transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify & Access Dashboard"
            )}
          </Button>

          {/* Back to Login Button */}
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full h-11 rounded-lg border-border text-foreground hover:bg-muted/50 font-medium text-sm transition-colors flex items-center justify-center"
            )}
          >
            ← Back to Login
          </Link>
        </div>

        {/* Code Expiration Info */}
        <div className="pt-1">
          <p className="text-xs font-semibold text-primary">
            Code expires in {formatTime(timeLeft)}
          </p>
        </div>
      </form>
    </div>
  );
}
