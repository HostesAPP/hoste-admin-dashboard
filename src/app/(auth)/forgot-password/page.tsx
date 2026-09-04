import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Forgot Password | Hosté Admin",
  description: "Request a password reset link for your staff account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
