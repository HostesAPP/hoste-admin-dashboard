import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OTP Verification | Hosté Admin",
  description: "Enter the one-time password sent to your staff email.",
};

export default function VerifyOtpPage() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">OTP Verification</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter the 6-digit verification code sent to your registered staff email.
      </p>
    </div>
  );
}
