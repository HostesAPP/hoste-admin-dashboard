"use client";

import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReferralsError({ reset }: { reset: () => void }) {
  return (
    <div
      className="flex min-h-[500px] flex-col items-center justify-center gap-3 p-8"
      role="alert"
    >
      <CircleAlert className="size-8 text-destructive" />
      <h1 className="text-lg font-semibold">Unable to load referrals</h1>
      <p className="text-sm text-muted-foreground">Please try again.</p>
      <Button variant="outline" onClick={reset}>
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}
