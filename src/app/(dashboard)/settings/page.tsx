"use client";

import React, { useState } from "react";
import {
  Settings,
  ShieldCheck,
  Globe,
  Bell,
  CreditCard,
  Save,
  Check,
  Lock,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_PLATFORM_SETTINGS } from "@/features/settings/data/settings.data";
import { PlatformSettings } from "@/features/settings/settings.types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Configuration & Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Global hosté platform parameters, localization, security rules, and feature flags.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="h-9 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs inline-flex items-center gap-2 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? "Saved Successfully" : "Save Changes"}</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Localization & Financial Configuration */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <span>Localization & Currency</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Default Currency</label>
              <Select
                value={settings.currency}
                onValueChange={(val) => val && setSettings({ ...settings, currency: val })}
              >
                <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="NGN">NGN (Nigerian Naira - ₦)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar - $)</SelectItem>
                  <SelectItem value="GBP">GBP (British Pound - £)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Timezone</label>
              <Select
                value={settings.timezone}
                onValueChange={(val) => val && setSettings({ ...settings, timezone: val })}
              >
                <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="Africa/Lagos (WAT, UTC+1)">Africa/Lagos (WAT, UTC+1)</SelectItem>
                  <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                  <SelectItem value="Europe/London (GMT)">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Platform Fee (%)</label>
              <Input
                type="number"
                value={settings.platformFeePercent}
                onChange={(e) => setSettings({ ...settings, platformFeePercent: Number(e.target.value) })}
                className="h-9 text-xs rounded-xl bg-background border-border"
              />
            </div>
          </div>
        </div>

        {/* Feature Flags & Operating Rules */}
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
                <span className="text-xs font-semibold text-foreground block">Allow New Registrations</span>
                <span className="text-[11px] text-muted-foreground">Enable or pause new customer and hosté signups globally.</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={settings.allowNewRegistrations}
                onClick={() => setSettings({ ...settings, allowNewRegistrations: !settings.allowNewRegistrations })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.allowNewRegistrations ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.allowNewRegistrations ? "translate-x-4.5" : "translate-x-1"}`} />
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

        {/* Notifications Dispatch Settings */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
          <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <span>Notification Delivery Channels</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-xs font-semibold text-foreground">Email Notifications</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.emailNotificationsEnabled}
                onClick={() => setSettings({ ...settings, emailNotificationsEnabled: !settings.emailNotificationsEnabled })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.emailNotificationsEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.emailNotificationsEnabled ? "translate-x-4.5" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-xs font-semibold text-foreground">Push Notifications</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.pushNotificationsEnabled}
                onClick={() => setSettings({ ...settings, pushNotificationsEnabled: !settings.pushNotificationsEnabled })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.pushNotificationsEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.pushNotificationsEnabled ? "translate-x-4.5" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
              <span className="text-xs font-semibold text-foreground">SMS Notifications</span>
              <button
                type="button"
                role="switch"
                aria-checked={settings.smsNotificationsEnabled}
                onClick={() => setSettings({ ...settings, smsNotificationsEnabled: !settings.smsNotificationsEnabled })}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  settings.smsNotificationsEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.smsNotificationsEnabled ? "translate-x-4.5" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
