import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Hosté Admin",
  description: "Set a new password for your staff account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Reset Password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose a secure new password for your account.
      </p>
    </div>
  );
}
