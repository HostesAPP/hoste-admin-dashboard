"use client";

import React, { useState } from "react";
import {
  Share2,
  Search,
  CheckCircle2,
  Clock,
  Gift,
  XCircle,
  AlertCircle,
  Download,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MOCK_REFERRALS, MOCK_REFERRAL_STATS } from "@/features/referrals/data/referrals.data";
import { Referral, ReferralStatus } from "@/features/referrals/referrals.types";

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string>("All");

  const filteredReferrals = referrals.filter((item) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        item.referralCode.toLowerCase().includes(q) ||
        item.referrerName.toLowerCase().includes(q) ||
        item.referredName.toLowerCase().includes(q) ||
        item.referrerEmail.toLowerCase().includes(q);

      if (!match) return false;
    }

    if (activeStatus !== "All" && item.status !== activeStatus) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case "Rewarded":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Rewarded</Badge>;
      case "Converted":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Converted</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
      case "Expired":
        return <Badge className="bg-muted text-muted-foreground border-border">Expired</Badge>;
      case "Rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Referral Code,Referrer,Referred,Status,Reward,Date"]
        .concat(
          referrals.map(
            (r) =>
              `${r.referralCode},${r.referrerName},${r.referredName},${r.status},${r.rewardAmount},${r.createdAt}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "referrals_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Referrals & Rewards
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track user referral links, conversions, invite statuses, and financial reward payouts.
          </p>
        </div>

        <Button
          onClick={handleExport}
          variant="outline"
          className="h-9 text-xs font-semibold rounded-xl border-border/80 bg-card hover:bg-muted/50 inline-flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Referrals</span>
            <Share2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_REFERRAL_STATS.totalReferrals}
          </div>
          <div className="text-[11px] text-muted-foreground">Across all user types</div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Converted Invites</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_REFERRAL_STATS.convertedCount}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {((MOCK_REFERRAL_STATS.convertedCount / MOCK_REFERRAL_STATS.totalReferrals) * 100).toFixed(1)}% conversion rate
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Rewarded Claims</span>
            <Gift className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {MOCK_REFERRAL_STATS.rewardedCount}
          </div>
          <div className="text-[11px] text-muted-foreground">Fully paid out</div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Rewards Paid</span>
            <Gift className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            ₦{(MOCK_REFERRAL_STATS.totalRewardsPaid / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-muted-foreground">Audit logged finance payouts</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-2xs space-y-4 p-5">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
          {["All", "Pending", "Converted", "Rewarded", "Expired", "Rejected"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveStatus(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeStatus === tab
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search code, referrer, or referred user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl text-xs bg-background border-border/80"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/80 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold text-foreground">Referral Code</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Referrer</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Referred User</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Reward</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Payment State</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                    No referrals found matching filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReferrals.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-bold text-xs text-primary">
                      {item.referralCode}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{item.referrerName}</span>
                        <span className="text-[10px] text-muted-foreground">{item.referrerEmail} ({item.referrerRole})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{item.referredName}</span>
                        <span className="text-[10px] text-muted-foreground">{item.referredEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ₦{item.rewardAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold ${
                          item.rewardPaymentStatus === "Paid"
                            ? "text-emerald-600"
                            : item.rewardPaymentStatus === "Pending"
                            ? "text-amber-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.rewardPaymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.createdAt}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
