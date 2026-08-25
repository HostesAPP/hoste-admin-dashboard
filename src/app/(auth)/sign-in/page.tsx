import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Hosté Admin",
  description: "Sign in to the Hosté Admin Dashboard",
};

export default function SignInPage() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-xl font-semibold">Sign In</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your staff credentials to access the admin portal.
      </p>
    </div>
  );
}
