import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Hosté Admin",
  description: "Request a password reset link for your staff account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Forgot Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your staff email address to receive password reset instructions.
      </p>
    </div>
  );
}
