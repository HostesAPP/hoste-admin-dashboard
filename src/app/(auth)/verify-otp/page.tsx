import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyOtpForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "OTP Verification | Hosté Admin",
  description: "Enter the one-time password sent to your staff email.",
};

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="w-full text-center py-10 text-xs text-muted-foreground">Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}

