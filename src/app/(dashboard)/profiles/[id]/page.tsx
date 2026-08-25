import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Details | Hosté Admin Dashboard",
  description: "View and review detailed profile information and KYC verification documents.",
};

interface ProfileDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileDetailsPage({
  params,
}: ProfileDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Profile Details</h1>
        <span className="text-sm font-mono text-muted-foreground">ID: {id}</span>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Profile attributes, KYC activation data, verification status, and documents preview section.
        </p>
      </div>
    </div>
  );
}
