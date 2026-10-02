"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  MoreHorizontal,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  User,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  Clock,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROFILES } from "../data/profiles.data";
import type { Profile, ActionType } from "../types/profiles.types";
import { ProfileActionModal } from "./ProfileActionModal";
import Image from "next/image";

interface ProfileDocumentsViewProps {
  profileId: string;
}

export function ProfileDocumentsView({ profileId }: ProfileDocumentsViewProps) {
  const [profile, setProfile] = useState<Profile | undefined>(() =>
    PROFILES.find((p) => p.id === profileId || p.hosteId === profileId)
  );

  const [activeTab, setActiveTab] = useState<
    "government_id" | "certificates" | "background_check"
  >("government_id");

  // Document viewer state
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);

  // Verification Checklist State
  const [idMatchChecked, setIdMatchChecked] = useState<boolean>(true);
  const [photoMatchChecked, setPhotoMatchChecked] = useState<boolean>(false);
  const [isFinalized, setIsFinalized] = useState<boolean>(false);

  // Admin notes state
  const [newNote, setNewNote] = useState("");
  const [adminNotes, setAdminNotes] = useState<string[]>([
    "Admin: Photo comparison looks good. Waiting on secondary reference",
    `User: ${profile?.displayName || "Amaka Okafor"} uploaded updated ID.`,
  ]);

  // Activity trail state
  const [activityTrail, setActivityTrail] = useState([
    {
      id: "act-1",
      date: "Aug 19, 2026",
      user: profile?.displayName || "Amaka Okafor",
      action: "Uploaded Government ID",
      note: "ID Updated",
    },
    {
      id: "act-2",
      date: "Aug 18, 2026",
      user: "John Admin (Admin)",
      action: "Review Initialed",
      note: "Checked application basic info.",
    },
  ]);

  // Action Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    actionType: ActionType;
    selectedProfile: Profile | null;
  }>({
    isOpen: false,
    actionType: null,
    selectedProfile: null,
  });

  if (!profile) {
    return (
      <div className="p-8 space-y-4">
        <Link href="/profiles">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs rounded-lg">
            <ChevronLeft className="w-4 h-4" />
            Back to Profiles
          </Button>
        </Link>
        <div className="bg-card rounded-2xl border border-border/80 p-12 text-center">
          <h2 className="text-base font-bold text-foreground">Profile Not Found</h2>
          <p className="text-xs text-muted-foreground mt-1">
            No profile was found matching ID: {profileId}
          </p>
        </div>
      </div>
    );
  }

  const isPending = profile.status === "Pending";

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 75));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    toast.success("Downloading document inspection bundle...");
  };

  const handleFinalizeVerification = () => {
    if (!idMatchChecked) {
      toast.error("Please confirm ID Match before finalizing.");
      return;
    }
    setIsFinalized(true);
    setActivityTrail((prev) => [
      {
        id: `act-${Date.now()}`,
        date: "Today",
        user: "Admin Officer",
        action: "Finalized ID Verification",
        note: "Government NIN verification approved.",
      },
      ...prev,
    ]);
    toast.success("ID Verification finalized successfully!");
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAdminNotes((prev) => [...prev, `Admin: ${newNote.trim()}`]);
    setNewNote("");
    toast.success("Admin note added.");
  };

  const handleOpenActionModal = (type: ActionType) => {
    setModalState({
      isOpen: true,
      actionType: type,
      selectedProfile: profile,
    });
  };

  const handleCloseActionModal = () => {
    setModalState({
      isOpen: false,
      actionType: null,
      selectedProfile: null,
    });
  };

  const handleConfirmAction = (
    _id: string,
    reason?: string,
    durationDays?: number
  ) => {
    if (!modalState.actionType) return;

    if (modalState.actionType === "approve") {
      setProfile((prev) =>
        prev ? { ...prev, status: "Active", verificationStatus: "Active" } : prev
      );
      toast.success(`Profile for ${profile.displayName} approved.`);
    } else if (modalState.actionType === "reject") {
      setProfile((prev) =>
        prev
          ? {
            ...prev,
            status: "Rejected",
            verificationStatus: "Rejected",
            activationData: { ...prev.activationData, rejectionReason: reason },
          }
          : prev
      );
      toast.error(`Profile application rejected.`);
    } else if (modalState.actionType === "suspend") {
      setProfile((prev) =>
        prev
          ? {
            ...prev,
            status: "Suspended",
            suspendedUntil: durationDays
              ? new Date(Date.now() + durationDays * 86400000).toISOString()
              : null,
          }
          : prev
      );
      toast.warning(`Profile suspended.`);
    } else if (modalState.actionType === "restore") {
      setProfile((prev) => (prev ? { ...prev, status: "Active" } : prev));
      toast.success(`Profile for ${profile.displayName} restored to active status.`);
    } else if (modalState.actionType === "ban") {
      setProfile((prev) => (prev ? { ...prev, status: "Deleted" } : prev));
      toast.error(`Profile deactivated.`);
    }
  };

  return (
    <div className="p-8 space-y-6 mx-auto">
      {/* Top Bar / Header */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-5 flex items-center justify-between gap-6">
        {/* Profile Info & Actions */}
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-full bg-muted/70 border border-border/60 flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
            {profile.avatarUrl ? (
              <Image
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-7 h-7 text-muted-foreground/70" />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-0.5">
            <div className="text-sm font-bold text-foreground">
              Name: <span className="font-semibold">{profile.displayName}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Role: {profile.categoryRole || "Professional Hosté"}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <span>Location: {profile.city}, {profile.country}</span>
              <span>•</span>
              <span>
                Status:{" "}
                <span
                  className={
                    profile.status === "Pending"
                      ? "text-primary font-semibold"
                      : profile.status === "Active"
                      ? "text-secondary font-semibold"
                      : profile.status === "Suspended"
                      ? "text-amber-600 font-semibold"
                      : "text-destructive font-semibold"
                  }
                >
                  {profile.status === "Pending"
                    ? "Pending Approval"
                    : profile.status === "Active"
                    ? "Approved"
                    : profile.status}
                </span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pl-4 border-l border-border/40">
            {profile.status === "Pending" ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenActionModal("reject")}
                  className="h-9 px-5 text-xs font-semibold rounded-lg border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  Reject
                </Button>

                <Button
                  type="button"
                  onClick={() => handleOpenActionModal("approve")}
                  className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                >
                  Approve Profile
                </Button>
              </>
            ) : profile.status === "Suspended" ||
              profile.status === "Deleted" ||
              profile.status === "Rejected" ? (
              <Button
                type="button"
                onClick={() => handleOpenActionModal("restore")}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                Restore Account
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => handleOpenActionModal("suspend")}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                Suspend Account
              </Button>
            )}
          </div>
        </div>

        {/* Navigation & More Actions */}
        <div className="flex items-center gap-2.5">
          <Link href={`/profiles/${profile.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back to Profiles</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-3 text-xs font-semibold rounded-lg border border-border/80 text-foreground hover:bg-muted transition-colors inline-flex items-center gap-1.5 cursor-pointer">
              <span>More actions</span>
              <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Verification link copied");
                }}
                className="text-xs cursor-pointer"
              >
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info("Audit log exported")}
                className="text-xs cursor-pointer text-muted-foreground"
              >
                Export Audit Log
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Left Column: DOCUMENT VIEW & INSPECTION */}
        <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
            DOCUMENT VIEW &amp; INSPECTION
          </h2>

          {/* Document Type Tabs */}
          <div className="flex items-center gap-6 border-b border-border/60 text-xs font-medium pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("government_id")}
              className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${activeTab === "government_id"
                  ? "border-b-2 border-primary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Government ID
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("certificates")}
              className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${activeTab === "certificates"
                  ? "border-b-2 border-primary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Training Certificates (2)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("background_check")}
              className={`pb-2 -mb-2.5 transition-colors cursor-pointer ${activeTab === "background_check"
                  ? "border-b-2 border-primary text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Background Check
            </button>
          </div>

          {/* Inspection Toolbar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleZoomIn}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                <ZoomIn className="w-4 h-4" />
                <span>Zoom In</span>
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                <ZoomOut className="w-4 h-4" />
                <span>Zoom Out</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                <RotateCw className="w-4 h-4" />
                <span>Rotate</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Document Preview Canvas */}
          <div className="bg-muted/30 border border-border/60 rounded-xl p-6 flex items-center justify-center min-h-65 overflow-hidden">
            <div
              style={{
                transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.2s ease-in-out",
              }}
              className="w-full max-w-lg bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 relative shadow-xs"
            >
              {/* Green Header Banner */}
              <div className="flex items-start justify-between gap-4 border-b border-emerald-500/20 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-8 bg-secondary rounded-xs flex flex-col justify-between py-1">
                    <span className="w-full h-1 bg-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground tracking-tight">
                      National Identity Number
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Federal Republic of Nigeria
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${isFinalized
                      ? "bg-secondary/15 text-secondary border-secondary/30"
                      : "bg-yellow/15 text-yellow-foreground border-yellow/30"
                    }`}
                >
                  {isFinalized ? "Identity: Verified" : "Identity: Unverified"}
                </span>
              </div>

              {/* ID Body */}
              <div className="flex items-center justify-between gap-6 py-5">
                <div className="space-y-2 text-xs">
                  <div className="w-8 h-6 bg-muted-foreground/30 rounded-xs border border-border" />
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      ID Type
                    </span>
                    <span className="font-bold text-foreground">NIN</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      ID Number
                    </span>
                    <span className="font-bold text-foreground">23456789012</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      Name on ID
                    </span>
                    <span className="font-semibold text-foreground">
                      {profile.displayName} Elizabeth
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      Expiry Date
                    </span>
                    <span className="text-muted-foreground">Oct 10, 2030</span>
                  </div>
                </div>

                {/* ID Photo Silhouette */}
                <div className="w-24 h-28 bg-muted/60 border border-border/80 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-14 h-14 text-muted-foreground/50" />
                </div>
              </div>

              {/* Bottom MRZ code */}
              <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-mono tracking-widest text-muted-foreground">
                NIN 2345 3134 &lt;&lt;&lt;&lt;&lt;&lt;
              </div>
            </div>
          </div>

          {/* Document Metadata + Face Match Comparison */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            {/* Left: Metadata */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">ID Type</span>
                <span className="font-bold text-foreground">NIN</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">ID Number</span>
                <span className="text-foreground">23456789012</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Name on ID</span>
                <span className="font-bold text-foreground">
                  {profile.displayName} Elizabeth
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Expiry Date</span>
                <span className="text-muted-foreground">Oct 10, 2030</span>
              </div>
            </div>

            {/* Right: Face Match Box */}
            <div className="bg-muted/30 border border-border/60 rounded-xl p-5 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center justify-center gap-3">
                {/* Photo 1 (from ID) */}
                <div className="w-12 h-12 rounded-full bg-muted/80 border border-border/80 flex items-center justify-center text-muted-foreground">
                  <User className="w-6 h-6" />
                </div>

                {/* Photo 2 (Profile Selfie) with primary ring */}
                <div className="w-12 h-12 rounded-full bg-muted/80 border-2 border-primary ring-2 ring-primary/20 flex items-center justify-center text-muted-foreground overflow-hidden">
                  {profile.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6" />
                  )}
                </div>
              </div>

              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                <span>88% Match</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Verification Status & Checklist + Admin Notes */}
        <div className="space-y-6">
          {/* Top Right Card: VERIFICATION STATUS & CHECKLIST */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              VERIFICATION STATUS &amp; CHECKLIST
            </h2>

            <div className="grid grid-cols-2 gap-6 items-start">
              {/* IDENTITY VERIFICATION */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  IDENTITY VERIFICATION
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-foreground">
                        ID Match
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        (Non-editable data review)
                      </span>
                    </div>
                    <Switch
                      checked={idMatchChecked}
                      onCheckedChange={setIdMatchChecked}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-foreground">
                      Photo Match
                    </span>
                    <Switch
                      checked={photoMatchChecked}
                      onCheckedChange={setPhotoMatchChecked}
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleFinalizeVerification}
                  disabled={isFinalized}
                  className="w-full h-9 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer mt-2"
                >
                  {isFinalized ? "ID Verified ✓" : "Finalize ID Verification"}
                </Button>
              </div>

              {/* BACKGROUND CHECK */}
              <div className="space-y-4 border-l border-border/40 pl-6">
                <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  BACKGROUND CHECK
                </h3>

                <div>
                  <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-md bg-yellow/15 text-yellow-foreground border border-yellow/30">
                    Pending Report
                  </span>
                </div>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info("Background check report requested.")}
                    className="w-full h-8 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Request New Report
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => toast.info("Reference check note added.")}
                    className="w-full h-8 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Add External Reference Check Note
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Card: ADMIN NOTES & AUDIT LOG */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              ADMIN NOTES &amp; AUDIT LOG
            </h2>

            {/* INTERNAL ADMIN NOTES */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                INTERNAL ADMIN NOTES
              </h3>

              <div className="bg-muted/30 border border-border/60 rounded-xl p-3.5 space-y-2 text-xs text-foreground/80">
                {adminNotes.map((note, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {note}
                  </p>
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-1">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add internal review note..."
                  className="h-8 text-xs rounded-lg"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 text-xs font-semibold rounded-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>

            {/* ACTIVITY TRAIL */}
            <div className="space-y-2.5 pt-2 border-t border-border/40">
              <h3 className="text-xs font-bold uppercase tracking-wide text-foreground">
                ACTIVITY TRAIL
              </h3>

              <div className="w-full text-xs">
                {/* Header */}
                <div className="grid grid-cols-4 pb-2 border-b border-border/60 text-muted-foreground font-medium">
                  <div>Date</div>
                  <div>User</div>
                  <div>Action</div>
                  <div>Note</div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border/30">
                  {activityTrail.map((trail) => (
                    <div
                      key={trail.id}
                      className="grid grid-cols-4 py-2.5 items-center text-xs"
                    >
                      <span className="text-muted-foreground">{trail.date}</span>
                      <span className="font-semibold text-foreground">
                        {trail.user}
                      </span>
                      <span className="text-foreground/90">{trail.action}</span>
                      <span className="text-muted-foreground">{trail.note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Dialog Modal */}
      <ProfileActionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseActionModal}
        actionType={modalState.actionType}
        profile={modalState.selectedProfile}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
