"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccessRestrictedProps {
  title?: string;
  message?: string;
  areaName?: string;
}

export function AccessRestricted({
  title = "Access Restricted",
  message,
  areaName,
}: AccessRestrictedProps) {
  const displayMessage =
    message ||
    (areaName
      ? `Your current staff role does not have permission to view or manage the ${areaName} module.`
      : "Your current staff role does not have permission to view or manage this section.");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-5 shadow-xs border border-destructive/20">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-bold text-foreground tracking-tight mb-2">
        {title}
      </h2>

      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        {displayMessage}
      </p>

      <div className="flex items-center gap-3">
        <Link href="/">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-muted text-xs font-semibold px-4 py-2 gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

