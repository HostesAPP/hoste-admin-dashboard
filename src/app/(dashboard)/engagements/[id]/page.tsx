"use client";

import { use } from "react";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Calendar, CheckCircle2, Clock, ShieldAlert, UserCheck, XCircle } from "lucide-react";
import { EngagementParticipant } from "@/features/engagements/types/engagements.types";

interface EngagementDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EngagementDetailPage({ params }: EngagementDetailPageProps) {
  const { id } = use(params);

  // Mock participants demonstrating PRD v2.2 §06: Declined vs Cancelled distinction
  const participants: EngagementParticipant[] = [
    {
      id: "part-01",
      engagementId: id,
      profileId: "prof-001",
      profileName: "Amara Okonkwo (Host)",
      role: "HOST",
      status: "Accepted",
      amount: 100000,
    },
    {
      id: "part-02",
      engagementId: id,
      profileId: "prof-002",
      profileName: "David Event Services",
      role: "COLLABORATOR",
      status: "Declined", // Pending → Declined: Normal decline. No moderation strike.
      amount: 30000,
    },
    {
      id: "part-03",
      engagementId: id,
      profileId: "prof-008",
      profileName: "Samson Sound Systems",
      role: "COLLABORATOR",
      status: "Cancelled", // Accepted → Cancelled: Triggers Profile Moderation Event strike!
      amount: 20000,
    },
  ];

  return (
    <PageHeaderLayout
      title={`Engagement Details (${id})`}
      description="View timeline, joined payment/escrow state, and participant status (Declined vs Moderation-triggering Cancelled)."
    >
      <div className="space-y-6">
        {/* State Matrix Info Card */}
        <div className="p-4 bg-muted/40 border border-border rounded-lg text-xs space-y-1">
          <h4 className="font-bold flex items-center gap-2 text-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Display Matrix Alignment (PRD v2.2 §06)
          </h4>
          <p className="text-muted-foreground">
            Backend Status: <code>ACCEPTED</code> • Payment Status: <code>Successful</code> → UI Display Label: <strong>Confirmed</strong>.
          </p>
        </div>

        {/* Overview Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 space-y-2 text-xs">
              <span className="text-muted-foreground block font-medium">Reference ID</span>
              <span className="font-mono font-bold text-sm block">ENG-260918-9901</span>
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                Confirmed
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2 text-xs">
              <span className="text-muted-foreground block font-medium">Booking Type</span>
              <span className="font-bold text-sm block">Full-Time Engagement</span>
              <span className="text-muted-foreground">Service Fee: 10% (₦15,000)</span>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-2 text-xs">
              <span className="text-muted-foreground block font-medium">Total Engagement Value</span>
              <span className="font-bold text-sm text-emerald-600 block">₦150,000</span>
              <span className="text-muted-foreground">Escrow Status: Held Safely</span>
            </CardContent>
          </Card>
        </div>

        {/* Participants Table */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-bold text-xs text-foreground">Participant Status & Moderation Consequences</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Participant Profile</TableHead>
                <TableHead className="text-xs">Role</TableHead>
                <TableHead className="text-xs">Amount</TableHead>
                <TableHead className="text-xs">Participant Status</TableHead>
                <TableHead className="text-xs">Moderation Consequence (PRD §06)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-xs font-semibold">{p.profileName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px]">
                      {p.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">₦{p.amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    {p.status === "Accepted" && (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        Accepted
                      </Badge>
                    )}
                    {p.status === "Declined" && (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 text-[10px]">
                        Declined (Pre-Accept)
                      </Badge>
                    )}
                    {p.status === "Cancelled" && (
                      <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                        Cancelled (Post-Accept)
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {p.status === "Declined" && (
                      <span className="text-muted-foreground text-[11px]">No moderation penalty. Normal decline.</span>
                    )}
                    {p.status === "Cancelled" && (
                      <span className="text-rose-600 font-medium text-[11px] flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Triggers Profile Moderation Event ladder strike!
                      </span>
                    )}
                    {p.status === "Accepted" && (
                      <span className="text-emerald-600 text-[11px]">Confirmed participant.</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageHeaderLayout>
  );
}
