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
import { AlertTriangle, ShieldAlert, Ban, Search, PlusCircle, Star, History } from "lucide-react";
import { toast } from "sonner";
import { MOCK_MODERATION_EVENTS } from "@/features/moderation/data/moderation.data";
import { ProfileModerationEvent, ModerationAction, InfractionTrigger } from "@/features/moderation/types/moderation.types";

export default function ModerationPage() {
  const [events, setEvents] = useState<ProfileModerationEvent[]>(MOCK_MODERATION_EVENTS);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Moderation Event Form state
  const [profileName, setProfileName] = useState("");
  const [email, setEmail] = useState("");
  const [action, setAction] = useState<ModerationAction>("WARNING");
  const [trigger, setTrigger] = useState<InfractionTrigger>("LOW_RATING");
  const [rating, setRating] = useState("3.8");
  const [cancellationStrikes, setCancellationStrikes] = useState("0");
  const [suspensionDays, setSuspensionDays] = useState("14");
  const [reason, setReason] = useState("");

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.profileName.toLowerCase().includes(search.toLowerCase()) ||
      evt.email.toLowerCase().includes(search.toLowerCase()) ||
      evt.reason.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "ALL" || evt.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleCreateEvent = () => {
    if (!profileName || !email || !reason) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const now = new Date();
    let suspendedUntilStr: string | undefined;

    if (action === "SUSPENSION") {
      const until = new Date(now.getTime() + parseInt(suspensionDays, 10) * 86400000);
      suspendedUntilStr = until.toISOString();
    }

    const newEvt: ProfileModerationEvent = {
      id: `MOD-2026-${(events.length + 1).toString().padStart(3, "0")}`,
      profileId: `prof-${Math.floor(Math.random() * 1000)}`,
      profileName,
      email,
      action,
      trigger,
      rating: trigger === "LOW_RATING" ? parseFloat(rating) : undefined,
      cancellationStrikeCount: trigger === "CANCELLATION_STRIKE" ? parseInt(cancellationStrikes, 10) : undefined,
      reason,
      issuedByStaffId: "staff-mod-current",
      issuedAt: now.toISOString(),
      suspendedUntil: suspendedUntilStr,
      active: true,
    };

    setEvents([newEvt, ...events]);
    toast.success(`Moderation event recorded! Action [${action}] applied to ${profileName}.`);
    setIsAddOpen(false);
    setProfileName("");
    setEmail("");
    setReason("");
  };

  const getActionBadge = (act: ModerationAction) => {
    switch (act) {
      case "WARNING":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Warning Issued</Badge>;
      case "SUSPENSION":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Suspended</Badge>;
      case "REMOVAL":
        return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">Account Terminated</Badge>;
      default:
        return <Badge variant="outline">{act}</Badge>;
    }
  };

  return (
    <PageHeaderLayout
      title="Content & Profile Moderation Engine"
      description="Track profile infractions, manage low rating alerts (<4.0 warning, <3.5 suspension), and execute escalating penalties."
    >
      <div className="space-y-6">
        {/* Escalating Ladder Explanatory Banner */}
        <div className="p-4 bg-muted/40 border border-border rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold flex items-center gap-2 text-foreground">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Escalating Moderation Ladder Rules (DB v1.2)
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Level 1: <strong>Warning</strong> (Rating below 4.0 or initial strike) • Level 2: <strong>Suspension</strong> (Rating below 3.5 or 3+ cancellation strikes) • Level 3: <strong>Removal</strong> (Severe breach).
            </p>
          </div>
          <Button size="sm" className="text-xs shrink-0 gap-1.5" onClick={() => setIsAddOpen(true)}>
            <PlusCircle className="w-3.5 h-3.5" />
            Issue Moderation Action
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Warnings</p>
                <p className="text-2xl font-bold mt-1">
                  {events.filter((e) => e.action === "WARNING" && e.active).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500 opacity-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Active Suspensions</p>
                <p className="text-2xl font-bold mt-1">
                  {events.filter((e) => e.action === "SUSPENSION" && e.active).length}
                </p>
              </div>
              <ShieldAlert className="w-8 h-8 text-orange-500 opacity-80" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Terminated Profiles</p>
                <p className="text-2xl font-bold mt-1">
                  {events.filter((e) => e.action === "REMOVAL").length}
                </p>
              </div>
              <Ban className="w-8 h-8 text-rose-500 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Search & Action Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search moderation event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            {["ALL", "WARNING", "SUSPENSION", "REMOVAL"].map((act) => (
              <Button
                key={act}
                variant={actionFilter === act ? "default" : "outline"}
                size="sm"
                onClick={() => setActionFilter(act)}
                className="text-xs shrink-0"
              >
                {act === "ALL" ? "All History" : act}
              </Button>
            ))}
          </div>
        </div>

        {/* Event Audit Table */}
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs">Event ID / Target</TableHead>
                <TableHead className="text-xs">Trigger Reason</TableHead>
                <TableHead className="text-xs">Action Taken</TableHead>
                <TableHead className="text-xs">Issued By</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Details / Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    No moderation events found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((evt) => (
                  <TableRow key={evt.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs">{evt.profileName}</span>
                        <span className="text-[11px] text-muted-foreground">{evt.id} • {evt.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {evt.trigger.replace("_", " ")}
                        </Badge>
                        {evt.rating && (
                          <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {evt.rating}
                          </span>
                        )}
                        {evt.cancellationStrikeCount && (
                          <span className="text-[11px] text-rose-600 font-semibold">
                            ({evt.cancellationStrikeCount} strikes)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(evt.action)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{evt.issuedByStaffId}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(evt.issuedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs max-w-xs">
                        <span className="truncate text-muted-foreground" title={evt.reason}>
                          {evt.reason}
                        </span>
                        {evt.suspendedUntil && (
                          <span className="text-[10px] text-orange-600 font-medium">
                            Until: {new Date(evt.suspendedUntil).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Issue Action Dialog */}
        {isAddOpen && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Issue Profile Moderation Action
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Target Profile Display Name</label>
                  <Input
                    placeholder="e.g. Kemi Luxe Events"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Target Email</label>
                  <Input
                    placeholder="e.g. kemi@luxeevents.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold block mb-1">Infraction Trigger</label>
                    <Select value={trigger} onValueChange={(val) => setTrigger(val as InfractionTrigger)}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW_RATING">Low Rating (&lt;4.0)</SelectItem>
                        <SelectItem value="CANCELLATION_STRIKE">Cancellation Strike</SelectItem>
                        <SelectItem value="REPORTED_LISTING">Reported Listing</SelectItem>
                        <SelectItem value="POLICY_VIOLATION">Policy Violation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="font-semibold block mb-1">Action Level</label>
                    <Select value={action} onValueChange={(val) => setAction(val as ModerationAction)}>
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WARNING">Warning</SelectItem>
                        <SelectItem value="SUSPENSION">Suspension</SelectItem>
                        <SelectItem value="REMOVAL">Termination / Removal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {action === "SUSPENSION" && (
                  <div>
                    <label className="font-semibold block mb-1">Suspension Duration (Days)</label>
                    <Input
                      type="number"
                      value={suspensionDays}
                      onChange={(e) => setSuspensionDays(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="font-semibold block mb-1">Mandatory Reason / Internal Notes</label>
                  <Textarea
                    placeholder="Explain the reason for this moderation enforcement..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="text-xs min-h-[80px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setIsAddOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCreateEvent} className="text-xs bg-amber-600 hover:bg-amber-700">
                  Confirm Moderation Action
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageHeaderLayout>
  );
}
