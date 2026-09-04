import type { Metadata } from "next";
import { VerifyOtpForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "OTP Verification | Hosté Admin",
  description: "Enter the one-time password sent to your staff email.",
};

export default function VerifyOtpPage() {
  return <VerifyOtpForm />;
}
