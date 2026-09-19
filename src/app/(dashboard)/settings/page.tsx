"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Settings,
  UserPlus,
  ShieldCheck,
  Globe,
  Bell,
  CreditCard,
  Save,
  Check,
  Users,
  Calendar,
  FileText,
  Lock,
  Terminal,
  History,
  AlertCircle,
  Mail,
  User,
  Shield,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_PLATFORM_SETTINGS } from "@/features/settings/data/settings.data";
import { PlatformSettings } from "@/features/settings/settings.types";

type SettingsTab =
  | "general"
  | "user-access"
  | "hoste-management"
  | "bookings-groups"
  | "payments-finance"
  | "notifications"
  | "platform-content"
  | "security"
  | "system-settings";

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as SettingsTab) || "general";
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    searchParams.get("tab") === "audit-log" ? "system-settings" : initialTab
  );

  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_PLATFORM_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);

  // Admin invitation modal state (v2.3 §1)
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("ADMIN");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setIsInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
    }, 1500);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "general", label: "General", icon: Globe },
    { id: "user-access", label: "User & Access", icon: Users },
    { id: "hoste-management", label: "Hosté Management", icon: ShieldCheck },
    { id: "bookings-groups", label: "Bookings & Groups", icon: Calendar },
    { id: "payments-finance", label: "Payments & Finance", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "platform-content", label: "Platform Content", icon: FileText },
    { id: "security", label: "Security", icon: Lock },
    { id: "system-settings", label: "System Settings", icon: Terminal },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            <span>Platform Settings & Administration</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure system parameters, access control, financial fees, and operational behavior.
          </p>
        </div>

        <Button
          onClick={handleSave}
          className="h-9 px-5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs inline-flex items-center gap-2 cursor-pointer"
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? "Saved Successfully" : "Save Settings"}</span>
        </Button>
      </div>

      {/* Sub-section Navigation Tabs (UI/UX Alignment Patch v2.3 §3) */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. General */}
        {activeTab === "general" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <span>General Platform Localization</span>
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
                <label className="text-xs font-semibold text-foreground">Support Email</label>
                <Input
                  type="email"
                  defaultValue="support@hoste.ng"
                  className="h-9 text-xs rounded-xl bg-background border-border"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. User & Access (Add Admin flow - v2.3 §1 & §4.1) */}
        {activeTab === "user-access" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-card border border-border/80 rounded-2xl p-6 shadow-2xs">
              <div>
                <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Admin User Management & Role Delegation</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Create/Invite administrators, assign staff roles, and manage system access permissions.
                </p>
              </div>

              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger
                  onClick={() => setIsInviteOpen(true)}
                  className="h-9 px-4 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs inline-flex items-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Create / Invite Admin</span>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-primary" />
                      <span>Create or Invite Admin</span>
                    </DialogTitle>
                  </DialogHeader>

                  {inviteSuccess ? (
                    <div className="py-6 text-center space-y-2">
                      <Check className="w-10 h-10 text-emerald-500 mx-auto" />
                      <p className="text-sm font-bold text-foreground">Admin Invitation Sent!</p>
                      <p className="text-xs text-muted-foreground">
                        An email invitation has been dispatched to {inviteEmail}.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleCreateAdmin} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Full Name</label>
                        <Input
                          required
                          placeholder="e.g. Chisom Okafor"
                          value={inviteName}
                          onChange={(e) => setInviteName(e.target.value)}
                          className="h-9 text-xs rounded-xl border-border bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Email Address</label>
                        <Input
                          required
                          type="email"
                          placeholder="admin@hoste.ng"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="h-9 text-xs rounded-xl border-border bg-background"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-foreground">Assign Staff Role</label>
                        <Select value={inviteRole} onValueChange={(val) => val && setInviteRole(val)}>
                          <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border">
                            <SelectItem value="SUPER_ADMIN">Super Admin (Full Access)</SelectItem>
                            <SelectItem value="ADMIN">Admin (Standard Access)</SelectItem>
                            <SelectItem value="FINANCE">Finance Specialist</SelectItem>
                            <SelectItem value="SUPPORT">Customer Support Lead</SelectItem>
                            <SelectItem value="MODERATOR">Content Moderator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* TODO: pending product confirmation — see UI/UX patch §4/§5 regarding whether Manage Permissions allows per-user toggles or strictly fixed StaffRoles */}
                      <div className="p-3 bg-muted/30 border border-amber-200/50 dark:border-amber-900/40 rounded-xl space-y-1">
                        <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block">
                          Role Permissions Note:
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Permissions adhere to the assigned staff role scope. (Pending product confirmation for individual override toggles).
                        </p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsInviteOpen(false)}
                          className="h-8 text-xs rounded-xl"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="h-8 text-xs rounded-xl bg-primary text-primary-foreground">
                          Send Invitation
                        </Button>
                      </div>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-foreground">Active Admin Directory</h3>
              <div className="divide-y divide-border/60">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      SA
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Super Admin</p>
                      <p className="text-[11px] text-muted-foreground">admin@hoste.ng</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-[10px]">
                    SUPER_ADMIN
                  </Badge>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      FN
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">Finance Admin</p>
                      <p className="text-[11px] text-muted-foreground">finance@hoste.ng</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[10px]">
                    FINANCE
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Hosté Management */}
        {activeTab === "hoste-management" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3">
              Hosté Onboarding & Activation Rules
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Require Identity Verification</span>
                  <span className="text-[11px] text-muted-foreground">Require Hostés to pass NIN/CAC verification before receiving bookings.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, allowNewRegistrations: !settings.allowNewRegistrations })}
                  className={`w-9 h-5 rounded-full relative cursor-pointer ${settings.allowNewRegistrations ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.allowNewRegistrations ? "translate-x-4.5" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Bookings & Groups */}
        {activeTab === "bookings-groups" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3">
              Booking & Group Policy Settings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Max Group Member Limit</label>
                <Input type="number" defaultValue={50} className="h-9 text-xs rounded-xl bg-background border-border" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Booking Grace Period (Hours)</label>
                <Input type="number" defaultValue={24} className="h-9 text-xs rounded-xl bg-background border-border" />
              </div>
            </div>
          </div>
        )}

        {/* 5. Payments & Finance */}
        {activeTab === "payments-finance" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Financial Configurations & Commission Rates</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Platform Service Fee (%)</label>
                <Input
                  type="number"
                  value={settings.platformFeePercent}
                  onChange={(e) => setSettings({ ...settings, platformFeePercent: Number(e.target.value) })}
                  className="h-9 text-xs rounded-xl bg-background border-border"
                />
              </div>

              {/* TODO: pending product confirmation — see UI/UX patch §5 regarding Payout.PlatformFlatFee field naming and referral earnings */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Referral Reward Earning (₦)</label>
                <Input type="number" defaultValue={1000} className="h-9 text-xs rounded-xl bg-background border-border" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Payout Escrow Lock (Days)</label>
                <Input type="number" defaultValue={3} className="h-9 text-xs rounded-xl bg-background border-border" />
              </div>
            </div>
          </div>
        )}

        {/* 6. Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span>Notification Dispatch Preferences</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
                <span className="text-xs font-semibold text-foreground">Email Delivery</span>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, emailNotificationsEnabled: !settings.emailNotificationsEnabled })}
                  className={`w-9 h-5 rounded-full relative cursor-pointer ${settings.emailNotificationsEnabled ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.emailNotificationsEnabled ? "translate-x-4.5" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
                <span className="text-xs font-semibold text-foreground">Push Delivery</span>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, pushNotificationsEnabled: !settings.pushNotificationsEnabled })}
                  className={`w-9 h-5 rounded-full relative cursor-pointer ${settings.pushNotificationsEnabled ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.pushNotificationsEnabled ? "translate-x-4.5" : "translate-x-1"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
                <span className="text-xs font-semibold text-foreground">SMS Delivery</span>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, smsNotificationsEnabled: !settings.smsNotificationsEnabled })}
                  className={`w-9 h-5 rounded-full relative cursor-pointer ${settings.smsNotificationsEnabled ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.smsNotificationsEnabled ? "translate-x-4.5" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 7. Platform Content */}
        {activeTab === "platform-content" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Platform Content & Promotional Banners</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage hero promotional banners, blog author defaults, and global terms/privacy copy.
            </p>
          </div>
        )}

        {/* 8. Security */}
        {activeTab === "security" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <span>System Security Controls</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Mandatory 2FA for Administrators</span>
                  <span className="text-[11px] text-muted-foreground">Enforce OTP/TOTP authentication on administrative logins.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, requireTwoFactorForAdmins: !settings.requireTwoFactorForAdmins })}
                  className={`w-9 h-5 rounded-full relative cursor-pointer ${settings.requireTwoFactorForAdmins ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.requireTwoFactorForAdmins ? "translate-x-4.5" : "translate-x-1"}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 9. System Settings (Includes Audit Log - v2.3 §4.4) */}
        {activeTab === "system-settings" && (
          <div className="space-y-6">
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
              <h2 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span>System Maintenance & Operations</span>
              </h2>

              <div className="flex items-center justify-between p-3 bg-muted/20 border border-border/60 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-foreground block">Maintenance Mode</span>
                  <span className="text-[11px] text-muted-foreground">Restrict client app connections for scheduled updates.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                  className={`w-9 h-5 rounded-full relative cursor-pointer ${settings.maintenanceMode ? "bg-destructive" : "bg-muted"}`}
                >
                  <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-4.5" : "translate-x-1"}`} />
                </button>
              </div>
            </div>

            {/* TODO: pending product confirmation — see UI/UX patch §4/§5 regarding whether Audit Log is top-level sidebar or nested under Settings -> System Settings */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <span>System Audit Logs</span>
              </h3>

              <div className="divide-y divide-border/60 text-xs font-mono">
                <div className="py-2.5 flex items-center justify-between text-muted-foreground">
                  <span>[2026-09-19 07:12:00] SUPER_ADMIN updated Platform Fee to {settings.platformFeePercent}%</span>
                  <Badge variant="outline" className="text-[10px]">SETTINGS_UPDATE</Badge>
                </div>
                <div className="py-2.5 flex items-center justify-between text-muted-foreground">
                  <span>[2026-09-19 06:45:10] FINANCE dispatched payout #PO-9021</span>
                  <Badge variant="outline" className="text-[10px]">PAYOUT_DISPATCH</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<div className="p-6 text-xs text-muted-foreground">Loading settings...</div>}>
      <SettingsContent />
    </React.Suspense>
  );
}
