import type { Metadata } from "next";
import { SignInForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Sign In | Hosté Admin",
  description: "Sign in to the Hosté Admin Dashboard",
};

export default function SignInPage() {
  return <SignInForm />;
}
