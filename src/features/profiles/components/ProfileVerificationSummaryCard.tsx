"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Profile } from "../types/profiles.types";

interface ProfileVerificationSummaryCardProps {
  profile: Profile;
}

export function ProfileVerificationSummaryCard({
  profile,
}: ProfileVerificationSummaryCardProps) {
  const summary = profile.verificationSummary || {
    identityStatus: "Pending",
    certificatesCount: 2,
    backgroundStatus: "Pending",
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-4">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        Verification Summary
      </h3>

      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Identity Verification —</span>
          <span className="font-semibold text-primary">
            {summary.identityStatus}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Certificates —</span>
          <span className="font-semibold text-foreground">
            {summary.certificatesCount} uploaded
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Background Verification —</span>
          <span className="font-semibold text-primary">
            {summary.backgroundStatus}
          </span>
        </div>
      </div>

      <div className="pt-2 border-t border-border/40 text-center">
        <Link
          href={`/profiles/${profile.id}/documents`}
          className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer transition-colors"
        >
          <span>View Verification &amp; Documents</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
