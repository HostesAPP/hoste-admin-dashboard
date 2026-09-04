import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Password | Hosté Admin",
  description: "Set a new password for your staff account.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
