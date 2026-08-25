import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Blocked | Hosté Admin",
  description: "Staff account access suspended or restricted.",
};

export default function AccountBlockedPage() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-destructive">Account Blocked</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your staff access has been suspended or restricted. Please contact your Super Administrator.
      </p>
    </div>
  );
}
