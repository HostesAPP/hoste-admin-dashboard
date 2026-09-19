"use client";

import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Ban } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ModerationPage() {
  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-500" />
          <span>Content & Account Moderation</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Review reported listings, profile infractions, suspended accounts, and platform compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Flagged Accounts</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-[11px] text-muted-foreground mt-1">Pending policy review</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Active Suspensions</span>
              <Ban className="w-4 h-4 text-destructive" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5</div>
            <p className="text-[11px] text-muted-foreground mt-1">Temporary lockouts active</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
              <span>Resolved Infractions</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">128</div>
            <p className="text-[11px] text-muted-foreground mt-1">Resolved in last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Moderation Queue</h2>
          <Badge variant="outline" className="text-xs">
            Filter: All Pending
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground italic border border-dashed border-border p-8 rounded-xl text-center">
          Moderation review queue items, user reports, and compliance logs will be processed here.
        </div>
      </div>
    </div>
  );
}
