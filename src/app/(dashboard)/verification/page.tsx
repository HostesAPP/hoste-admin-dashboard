"use client";

// TODO: pending confirmation - CAC verification provider integration (PRD v2.3 §7 & §23)

import { useState } from "react";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, ShieldCheck, CheckCircle2, XCircle, FileText, ExternalLink, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { MOCK_VERIFICATION_APPLICATIONS } from "@/features/verification/data/verification.data";
import { VerificationApplication } from "@/features/verification/types/verification.types";
import { VerificationStatus } from "@/features/profiles/types/profiles.types";

export default function VerificationPage() {
  const [applications, setApplications] = useState<VerificationApplication[]>(MOCK_VERIFICATION_APPLICATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.profileName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, status: "Approved_Awaiting_Payment" as VerificationStatus }
          : app
      )
    );
    toast.success("Verification application approved! Profile is now awaiting ₦5,000 fee payment.");
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) => prev ? { ...prev, status: "Approved_Awaiting_Payment" as VerificationStatus } : null);
    }
  };

  const handleConfirmPayment = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? {
              ...app,
              status: "Active" as VerificationStatus,
              feePaymentStatus: "Paid",
              paymentReference: `PAY-${Date.now().toString().slice(-6)}`,
            }
          : app
      )
    );
    toast.success("Circle Verification badge is now ACTIVE for this profile!");
    if (selectedApp?.id === appId) {
      setSelectedApp((prev) =>
        prev
          ? {
              ...prev,
              status: "Active" as VerificationStatus,
              feePaymentStatus: "Paid",
              paymentReference: `PAY-${Date.now().toString().slice(-6)}`,
            }
          : null
      );
    }
  };

  const handleReject = () => {
    if (!selectedApp || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }
    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id
          ? { ...app, status: "Rejected" as VerificationStatus, rejectedReason: rejectReason }
          : app
      )
    );
    toast.info("Verification application rejected.");
    setIsRejectOpen(false);
    setRejectReason("");
    setSelectedApp(null);
  };

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "Pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending Review</Badge>;
      case "Approved_Awaiting_Payment":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Awaiting Payment (₦5k)</Badge>;
      case "Active":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Verified (Active)</Badge>;
      case "Rejected":
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Rejected</Badge>;
      case "Expired":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <PageHeaderLayout
      title='Verification ("The Circle") Management'
      description='Review identity & business verification applications for verified badge placement.'
    >
      <div className="space-y-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Pending Review</p>
                <p className="text-2xl font-bold mt-1">
                  {applications.filter((a) => a.status === "Pending").length}
                </p>
              </div>
              <ShieldCheck className="w-8 h-8 text-amber-500 opacity-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Awaiting Fee (₦5,000)</p>
                <p className="text-2xl font-bold mt-1">
                  {applications.filter((a) => a.status === "Approved_Awaiting_Payment").length}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500 opacity-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Circle Badges</p>
                <p className="text-2xl font-bold mt-1">
                  {applications.filter((a) => a.status === "Active").length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Rejected Applications</p>
                <p className="text-2xl font-bold mt-1">
                  {applications.filter((a) => a.status === "Rejected").length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-rose-500 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by profile or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["ALL", "Pending", "Approved_Awaiting_Payment", "Active", "Rejected"].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="text-xs shrink-0"
              >
                {status === "ALL" ? "All Queue" : status.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">App ID / Profile</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs">Submitted Data</TableHead>
                <TableHead className="text-xs">Status</TableHead>
                <TableHead className="text-xs">Fee Status</TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    No verification applications found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{app.profileName}</span>
                        <span className="text-[11px] text-muted-foreground">{app.id} • {app.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {app.profileType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs">{app.submittedData.idType}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          app.feePaymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                            : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                        }
                      >
                        {app.feePaymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => setSelectedApp(app)}
                        >
                          Inspect
                        </Button>
                        {app.status === "Pending" && (
                          <Button
                            size="sm"
                            className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => handleApprove(app.id)}
                          >
                            Approve
                          </Button>
                        )}
                        {app.status === "Approved_Awaiting_Payment" && (
                          <Button
                            size="sm"
                            className="text-xs h-7 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleConfirmPayment(app.id)}
                          >
                            Confirm Payment (₦5k)
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Application Details Dialog */}
        {selectedApp && (
          <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Verification Application Inspection ({selectedApp.id})</span>
                  {getStatusBadge(selectedApp.status)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-md">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Applicant Profile</span>
                    <span className="font-semibold">{selectedApp.profileName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Profile Type</span>
                    <span className="font-semibold">{selectedApp.profileType}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Email</span>
                    <span>{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Phone</span>
                    <span>{selectedApp.phone}</span>
                  </div>
                </div>

                <div className="border border-border p-3 rounded-md space-y-2">
                  <h4 className="font-semibold text-xs border-b border-border/50 pb-1">Submitted Document Data</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">ID / Document Type</span>
                      <span>{selectedApp.submittedData.idType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Document Number</span>
                      <span>{selectedApp.submittedData.idNumber}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="text-muted-foreground block text-[10px] mb-1">Uploaded Document File</span>
                    <a
                      href={selectedApp.submittedData.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Document
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                  <p className="text-[11px] text-amber-800 dark:text-amber-200">
                    <strong>Notice:</strong> Approving Circle Verification changes status to <code>Approved_Awaiting_Payment</code>. The Circle badge will activate upon successful payment of the ₦5,000 fee. Approving verification does NOT alter overall <code>Profile.status</code>.
                  </p>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between sm:justify-between gap-2">
                {selectedApp.status === "Pending" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs"
                    onClick={() => setIsRejectOpen(true)}
                  >
                    Reject Application
                  </Button>
                )}
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => setSelectedApp(null)} className="text-xs">
                    Close
                  </Button>
                  {selectedApp.status === "Pending" && (
                    <Button
                      size="sm"
                      className="text-xs bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(selectedApp.id)}
                    >
                      Approve Application
                    </Button>
                  )}
                  {selectedApp.status === "Approved_Awaiting_Payment" && (
                    <Button
                      size="sm"
                      className="text-xs bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleConfirmPayment(selectedApp.id)}
                    >
                      Confirm Payment & Activate Badge
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Rejection Modal */}
        {isRejectOpen && (
          <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold text-rose-600">
                  Reject Verification Application
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-xs">
                <p className="text-muted-foreground">
                  Please provide a clear reason for rejecting this verification request. This reason will be communicated to the profile owner.
                </p>
                <Textarea
                  placeholder="e.g. Identity document uploaded is illegible or expired."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="text-xs min-h-[90px]"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsRejectOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button variant="destructive" size="sm" onClick={handleReject} className="text-xs">
                  Confirm Rejection
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageHeaderLayout>
  );
}
