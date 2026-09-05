"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Headphones, Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccountLockedProps {
  initialLockSeconds?: number;
}

export function AccountLocked({ initialLockSeconds = 900 }: AccountLockedProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialLockSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
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

      <div className="w-full text-center space-y-6">
        {/* Lock Icon & Header */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Account Locked
          </h1>
          <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
            Too many failed login attempts. For your security, we&apos;ve
            temporarily locked your account.
          </p>
        </div>

        {/* Lock Countdown Card */}
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-5 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-destructive">
            <Clock className="w-4 h-4" />
            <span>Please try again in</span>
          </div>
          <div className="text-2xl font-bold tracking-tight text-destructive">
            {formatTime(secondsLeft)}
          </div>
          <p className="text-xs text-destructive/80 font-medium">minutes</p>
        </div>

        {/* Trouble / Reset Prompt Card */}
        <div className="rounded-xl border border-secondary/20 bg-secondary/10 p-5 text-center space-y-1">
          <h2 className="text-xs sm:text-sm font-semibold text-foreground">
            Still having trouble?
          </h2>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
            You can reset your password now to regain access to your account
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-1">
          {/* Send Reset Link Button */}
          <Link
            href="/forgot-password"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center"
            )}
          >
            Send Reset Link
          </Link>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-border" />
            <span className="absolute bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              OR
            </span>
          </div>

          {/* Contact Support Button */}
          <Link
            href="/customer-support"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full h-11 rounded-lg border-border text-foreground hover:bg-muted/50 font-medium text-sm transition-colors flex items-center justify-center gap-2"
            )}
          >
            <Headphones className="w-4 h-4" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
