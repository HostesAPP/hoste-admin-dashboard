"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Share2, CheckCircle2, Clock, DollarSign, ExternalLink, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { MOCK_REFERRALS } from "@/features/referrals/data/referrals.data";
import { ReferralRecord, ReferralStatus, QualifyingStatus, ReferralPayoutStatus } from "@/features/referrals/types/referrals.types";

// TODO: pending product confirmation for referral threshold/progress mechanic per PRD v2.2 §11
// TODO: pending product confirmation for separate rewards & approvals workflow per PRD v2.2 §12

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRecord[]>(MOCK_REFERRALS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [qualifyingFilter, setQualifyingFilter] = useState("ALL");
  const [selectedReferral, setSelectedReferral] = useState<ReferralRecord | null>(null);

  const filteredReferrals = referrals.filter((ref) => {
    const matchesSearch =
      ref.referrerName.toLowerCase().includes(search.toLowerCase()) ||
      ref.referredBrandName.toLowerCase().includes(search.toLowerCase()) ||
      ref.referenceId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || ref.referralStatus === statusFilter;
    const matchesQualifying = qualifyingFilter === "ALL" || ref.qualifyingStatus === qualifyingFilter;

    return matchesSearch && matchesStatus && matchesQualifying;
  });

  const getReferralStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">Pending</Badge>;
      case "Qualified":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">Qualified</Badge>;
      case "Paid":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Paid (₦1,000)</Badge>;
      case "Expired":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-[10px]">Expired</Badge>;
      case "Cancelled":
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">Cancelled</Badge>;
    }
  };

  const getQualifyingBadge = (st: QualifyingStatus) => {
    switch (st) {
      case "Not Qualified":
        return <Badge variant="secondary" className="text-[10px]">Not Qualified</Badge>;
      case "Qualifying Engagement Completed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">Engagement Completed</Badge>;
      case "Qualified":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Fully Qualified</Badge>;
    }
  };

  return (
    <PageHeaderLayout
      title="Referral Program Management"
      description="Track Host-to-Brand referrals, ₦1,000 one-time reward qualifications, and payout processing (PRD v2.2)."
    >
      <div className="space-y-6">
        {/* Metric Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Referrals</p>
                <p className="text-2xl font-bold mt-1">{referrals.length}</p>
              </div>
              <Share2 className="w-8 h-8 text-primary opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Qualified Earning (₦1k)</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {referrals.filter((r) => r.referralStatus === "Qualified").length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Paid Referrals</p>
                <p className="text-2xl font-bold mt-1 text-emerald-600">
                  {referrals.filter((r) => r.referralStatus === "Paid").length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Pending Payouts</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">
                  {referrals.filter((r) => r.payoutStatus === "Pending").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-amber-500 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search profile name or Ref ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            {["ALL", "Pending", "Qualified", "Paid", "Expired", "Cancelled"].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className="text-xs shrink-0 h-7"
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        {/* Referrals Main Table */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Ref ID / Referrer</TableHead>
                <TableHead className="text-xs">Referred Brand</TableHead>
                <TableHead className="text-xs">Referral Status</TableHead>
                <TableHead className="text-xs">Qualifying Status</TableHead>
                <TableHead className="text-xs">Earning Amount</TableHead>
                <TableHead className="text-xs">Payout Status</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                    No referral records found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReferrals.map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          href={`/profiles/${ref.referrerProfileId}`}
                          className="font-semibold text-xs text-primary hover:underline"
                        >
                          {ref.referrerName}
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground">{ref.referenceId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/profiles/${ref.referredBrandProfileId}`}
                        className="text-xs font-medium text-foreground hover:underline"
                      >
                        {ref.referredBrandName}
                      </Link>
                    </TableCell>
                    <TableCell>{getReferralStatusBadge(ref.referralStatus)}</TableCell>
                    <TableCell>{getQualifyingBadge(ref.qualifyingStatus)}</TableCell>
                    <TableCell className="text-xs font-bold text-emerald-600">
                      ₦{ref.earningAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {ref.payoutStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => setSelectedReferral(ref)}
                      >
                        Inspect Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Referral Details Dialog (PRD §10) */}
        {selectedReferral && (
          <Dialog open={!!selectedReferral} onOpenChange={(open) => !open && setSelectedReferral(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Referral Case Details ({selectedReferral.referenceId})</span>
                  {getReferralStatusBadge(selectedReferral.referralStatus)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-xs">
                {/* Referrer & Referred Brand Cards */}
                <div className="p-3 bg-muted/40 rounded-md space-y-2">
                  <span className="font-bold text-xs border-b border-border/50 pb-1 block">Referral Entity Links</span>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[10px]">Referrer Host:</span>
                    <Link href={`/profiles/${selectedReferral.referrerProfileId}`} className="font-semibold text-primary hover:underline flex items-center gap-1">
                      {selectedReferral.referrerName}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[10px]">Referred Brand:</span>
                    <Link href={`/profiles/${selectedReferral.referredBrandProfileId}`} className="font-semibold text-primary hover:underline flex items-center gap-1">
                      {selectedReferral.referredBrandName}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Qualification & Earning */}
                <div className="p-3 border border-border rounded-md space-y-2">
                  <span className="font-bold text-xs border-b border-border/50 pb-1 block">Qualification & Earning</span>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[10px]">Qualifying Status:</span>
                    {getQualifyingBadge(selectedReferral.qualifyingStatus)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[10px]">Earning Amount:</span>
                    <span className="font-bold text-emerald-600 text-xs">₦1,000</span>
                  </div>
                  {selectedReferral.qualifyingEngagementId && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Qualifying Engagement:</span>
                      <Link href={`/engagements/${selectedReferral.qualifyingEngagementId}`} className="font-mono text-primary hover:underline">
                        {selectedReferral.qualifyingEngagementId}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Payout Details */}
                <div className="p-3 bg-card border border-border rounded-md space-y-1">
                  <span className="font-bold text-xs border-b border-border/50 pb-1 block">Payout Record</span>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-[10px]">Payout Status:</span>
                    <Badge variant="outline" className="text-[10px]">{selectedReferral.payoutStatus}</Badge>
                  </div>
                  {selectedReferral.payoutReferenceId && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-[10px]">Payout Reference:</span>
                      <span className="font-mono text-[11px]">{selectedReferral.payoutReferenceId}</span>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelectedReferral(null)} className="text-xs">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageHeaderLayout>
  );
}
