"use client";

import { useState } from "react";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, AlertCircle, CheckCircle, ExternalLink, Lock, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { MOCK_DISPUTES } from "@/features/disputes/data/disputes.data";
import { ReportDispute, DisputePriority, DisputeTeam } from "@/features/disputes/types/disputes.types";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<ReportDispute[]>(MOCK_DISPUTES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedDispute, setSelectedDispute] = useState<ReportDispute | null>(null);

  // Edit / Resolution state
  const [internalNote, setInternalNote] = useState("");
  const [resolutionStatus, setResolutionStatus] = useState<string>("");

  const filteredDisputes = disputes.filter((dsp) => {
    const matchesSearch =
      dsp.id.toLowerCase().includes(search.toLowerCase()) ||
      dsp.description.toLowerCase().includes(search.toLowerCase()) ||
      dsp.issueCategory.toLowerCase().includes(search.toLowerCase()) ||
      (dsp.engagementId && dsp.engagementId.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || dsp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateDispute = () => {
    if (!selectedDispute) return;

    setDisputes((prev) =>
      prev.map((d) =>
        d.id === selectedDispute.id
          ? {
              ...d,
              internalNote: internalNote || d.internalNote,
              status: (resolutionStatus as ReportDispute["status"]) || d.status,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );

    toast.success(`Dispute ${selectedDispute.id} updated! Escrow & notification states synced.`);
    setSelectedDispute(null);
  };

  const getPriorityBadge = (priority: DisputePriority) => {
    switch (priority) {
      case "URGENT":
        return <Badge className="bg-rose-600 text-white font-bold text-[10px]">URGENT</Badge>;
      case "HIGH":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-[10px]">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-[10px]">MEDIUM</Badge>;
      case "LOW":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-[10px]">LOW</Badge>;
    }
  };

  return (
    <PageHeaderLayout
      title="Disputes & Escalations Management"
      description="Resolve formal ReportDispute records, manage escrow blocks, and direct dispute team investigations."
    >
      <div className="space-y-6">
        {/* Tier 3 Lifecycle Info Banner */}
        <div className="p-4 bg-muted/40 border border-border rounded-lg text-xs space-y-1">
          <h4 className="font-bold flex items-center gap-2 text-foreground">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            Three-Tier Escalation Architecture (PRD §6.9)
          </h4>
          <p className="text-muted-foreground">
            Tier 1: Live Customer Conversation → Tier 2: Support Ticket → Tier 3: <strong>ReportDispute</strong>. Escalating to ReportDispute automatically blocks Payout release on linked Engagements.
          </p>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Open Disputes</p>
                <p className="text-2xl font-bold mt-1">
                  {disputes.filter((d) => d.status === "OPEN").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Under Review</p>
                <p className="text-2xl font-bold mt-1">
                  {disputes.filter((d) => d.status === "UNDER_REVIEW").length}
                </p>
              </div>
              <ShieldAlert className="w-8 h-8 text-orange-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Resolved (Refunded)</p>
                <p className="text-2xl font-bold mt-1">
                  {disputes.filter((d) => d.status === "RESOLVED_REFUNDED").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Dismissed</p>
                <p className="text-2xl font-bold mt-1">
                  {disputes.filter((d) => d.status === "RESOLVED_DISMISSED").length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-gray-500 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by dispute ID, category, engagement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED_REFUNDED", "RESOLVED_DISMISSED"].map((st) => (
              <Button
                key={st}
                variant={statusFilter === st ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(st)}
                className="text-xs shrink-0"
              >
                {st === "ALL" ? "All Queue" : st.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Disputes Table */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Dispute ID / Engagement</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Assigned Team</TableHead>
                <TableHead className="text-xs">Priority</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDisputes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    No disputes found matching search criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDisputes.map((dsp) => (
                  <TableRow key={dsp.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{dsp.id}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {dsp.engagementId || "No Engagement FK"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium">{dsp.issueCategory}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {dsp.assignedDisputeTeam.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(dsp.priorityLevel)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {dsp.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => {
                          setSelectedDispute(dsp);
                          setInternalNote(dsp.internalNote);
                          setResolutionStatus(dsp.status);
                        }}
                      >
                        Manage Case
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dispute Case Inspection Dialog */}
        {selectedDispute && (
          <Dialog open={!!selectedDispute} onOpenChange={(open) => !open && setSelectedDispute(null)}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Dispute Management Case ({selectedDispute.id})</span>
                  {getPriorityBadge(selectedDispute.priorityLevel)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-xs">
                {/* Public / Customer Description */}
                <div className="p-3 bg-muted/40 rounded-md space-y-1">
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                    Customer-Facing Dispute Description
                  </span>
                  <p className="text-foreground leading-relaxed">{selectedDispute.description}</p>
                </div>

                {/* Staff-Only Internal Notes (PRD Security Isolation Requirement) */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Staff-Only Restricted Field (internalNote)</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    This note is strictly omitted from customer-facing API responses (enforced at API DTO layer).
                  </p>
                  <Textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Enter internal staff notes, investigation findings, or escrow hold directives..."
                    className="text-xs min-h-[70px] bg-background"
                  />
                </div>

                {/* Dispute Metadata */}
                <div className="grid grid-cols-2 gap-3 p-3 border border-border rounded-md">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">What Has Been Tried</span>
                    <p className="text-[11px] mt-0.5">{selectedDispute.whatHasBeenTried}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Customer Notification Toggle</span>
                    <Badge variant={selectedDispute.notifyCustomer ? "default" : "outline"} className="text-[10px] mt-1">
                      {selectedDispute.notifyCustomer ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </div>

                {/* Status Update Control */}
                <div>
                  <label className="font-semibold block mb-1">Update Case Status</label>
                  <Select value={resolutionStatus} onValueChange={(val) => setResolutionStatus(val ?? "")}>
                    <SelectTrigger className="text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="RESOLVED_REFUNDED">Resolved (Full / Partial Refund)</SelectItem>
                      <SelectItem value="RESOLVED_DISMISSED">Resolved (Dismissed / Release Escrow)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelectedDispute(null)} className="text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUpdateDispute} className="text-xs bg-primary">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageHeaderLayout>
  );
}
