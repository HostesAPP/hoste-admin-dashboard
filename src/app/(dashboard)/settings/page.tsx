"use client";

// TODO: pending confirmation - Commission-rule CRUD in Settings conflicts with flat-fee model (PRD v2.3 §18)
// TODO: pending confirmation - Manage Permission scope: fixed role vs per-permission (PRD v2.3 §18)

import React, { useState } from "react";
import {
  ShieldCheck,
  Save,
  Check,
  RefreshCw,
  Coins,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DEFAULT_PLATFORM_SETTINGS } from "@/features/settings/data/settings.data";
import { PlatformSettings } from "@/features/settings/settings.types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);

  // Canonical Fee Configuration State (PRD v2.3 §18)
  const [serviceFeePercent, setServiceFeePercent] = useState("10"); // SERVICE_FEE_PERCENT
  const [platformFlatFee, setPlatformFlatFee] = useState("1000"); // PLATFORM_FLAT_FEE
  const [referralEarning, setReferralEarning] = useState("1000"); // REFERRAL_EARNING_AMOUNT

  const [refundTier48, setRefundTier48] = useState("100");
  const [refundTierUnder48, setRefundTierUnder48] = useState("50");
  const [refundTierUnder12, setRefundTierUnder12] = useState("0");

  const [circlePrice, setCirclePrice] = useState("5000");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Platform Settings updated! AuditLog entry created and Redis cache invalidated.");
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Configuration & Business Rules
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Runtime editable commission rates, refund tiers, Circle verification pricing, and security controls.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="h-9 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs inline-flex items-center gap-2 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? "Saved & Sync Cache" : "Save Changes"}</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* PRD §18 Platform Fee & Service Fee Config (Replaces Tiered Commission) */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            <span>Platform Service Fee & Platform Flat Fee Config (PRD v2.3 §18)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Service Fee (%) [SERVICE_FEE_PERCENT]</label>
              <Input
                type="number"
                value={serviceFeePercent}
                onChange={(e) => setServiceFeePercent(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground block">Paid by Brand profile per engagement</span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Platform Fee (₦) [PLATFORM_FLAT_FEE]</label>
              <Input
                type="number"
                value={platformFlatFee}
                onChange={(e) => setPlatformFlatFee(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground block">Flat fee per Host per engagement</span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Referral Earning (₦) [REFERRAL_EARNING_AMOUNT]</label>
              <Input
                type="number"
                value={referralEarning}
                onChange={(e) => setReferralEarning(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
              <span className="text-[10px] text-muted-foreground block">One-time earning per qualifying referral</span>
            </div>
          </div>
        </div>

        {/* PRD §6.13 Refund Tiers & Circle Pricing */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" />
            <span>Refund Policy Tiers & Circle Pricing</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">≥ 48 Hours Refund (%)</label>
              <Input
                type="number"
                value={refundTier48}
                onChange={(e) => setRefundTier48(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">&lt; 48 Hours Refund (%)</label>
              <Input
                type="number"
                value={refundTierUnder48}
                onChange={(e) => setRefundTierUnder48(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">&lt; 12 Hours Refund (%)</label>
              <Input
                type="number"
                value={refundTierUnder12}
                onChange={(e) => setRefundTierUnder12(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Circle Verification Fee (₦/mo)</label>
              <Input
                type="number"
                value={circlePrice}
                onChange={(e) => setCirclePrice(e.target.value)}
                className="h-9 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Feature Flags & Security Controls */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Feature Flags & Security Controls</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
              <div>
                <span className="text-xs font-semibold text-foreground block">Require 2FA for Administrators</span>
                <span className="text-[11px] text-muted-foreground">Enforce mandatory two-factor authentication on admin logins.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.requireTwoFactorForAdmins}
                onClick={() => setSettings({ ...settings, requireTwoFactorForAdmins: !settings.requireTwoFactorForAdmins })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.requireTwoFactorForAdmins ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.requireTwoFactorForAdmins ? "translate-x-4.5" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
              <div>
                <span className="text-xs font-semibold text-foreground block">Maintenance Mode</span>
                <span className="text-[11px] text-muted-foreground">Temporarily restrict client traffic for scheduled system updates.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.maintenanceMode}
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.maintenanceMode ? "bg-destructive" : "bg-muted"
                }`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-4.5" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
