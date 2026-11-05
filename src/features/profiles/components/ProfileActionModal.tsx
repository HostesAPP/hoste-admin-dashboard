"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Profile, ActionType } from "../types/profiles.types";

export type { ActionType };

const REJECT_REASONS = [
  "Invalid or incomplete documents",
  "Verification failed",
  "Inaccurate information",
  "Profile does not meet requirements",
  "Other",
];

const SUSPEND_DURATIONS = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
  { label: "90 Days", value: 90 },
];

interface ProfileActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  profile: Profile | null;
  onConfirm: (
    profileId: string,
    reason?: string,
    durationDays?: number,
  ) => void;
}

export function ProfileActionModal({
  isOpen,
  onClose,
  actionType,
  profile,
  onConfirm,
}: ProfileActionModalProps) {
  const router = useRouter();
  const [selectedRejectReason, setSelectedRejectReason] = useState<string>(
    REJECT_REASONS[0],
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState<number>(30);
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);

  // Validation error states
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [suspendError, setSuspendError] = useState<string | null>(null);
  const [banError, setBanError] = useState<string | null>(null);

  if (!profile || !actionType) return null;

  const handleClose = () => {
    setIsApprovedSuccess(false);
    setAdditionalNotes("");
    setSuspendReason("");
    setSuspendDuration(30);
    setSelectedRejectReason(REJECT_REASONS[0]);
    setRejectError(null);
    setSuspendError(null);
    setBanError(null);
    onClose();
  };

  const handleApproveSubmit = () => {
    onConfirm(profile.id);
    setIsApprovedSuccess(true);
  };

  const handleRejectSubmit = () => {
    const trimmedNotes = additionalNotes.trim();

    // Validation: "Other" requires detailed notes
    if (selectedRejectReason === "Other") {
      if (!trimmedNotes) {
        setRejectError("Please provide a reason when selecting 'Other'.");
        return;
      }
      if (trimmedNotes.length < 5) {
        setRejectError("Rejection reason must be at least 5 characters.");
        return;
      }
    }

    if (trimmedNotes.length > 500) {
      setRejectError("Rejection notes cannot exceed 500 characters.");
      return;
    }

    setRejectError(null);
    const fullReason = trimmedNotes
      ? `${selectedRejectReason}: ${trimmedNotes}`
      : selectedRejectReason;
    onConfirm(profile.id, fullReason);
    handleClose();
  };

  const handleSuspendSubmit = () => {
    const trimmed = suspendReason.trim();

    // Validation: reason is required
    if (!trimmed) {
      setSuspendError("Please provide a reason for suspension.");
      return;
    }
    if (trimmed.length < 5) {
      setSuspendError("Suspension reason must be at least 5 characters.");
      return;
    }
    if (trimmed.length > 500) {
      setSuspendError("Suspension reason cannot exceed 500 characters.");
      return;
    }

    setSuspendError(null);
    onConfirm(profile.id, trimmed, suspendDuration);
    handleClose();
  };

  const handleRestoreSubmit = () => {
    onConfirm(profile.id);
    handleClose();
  };

  const handleBanSubmit = () => {
    const trimmed = suspendReason.trim();

    // Validation: reason is required
    if (!trimmed) {
      setBanError("Please provide a reason for deactivating this account.");
      return;
    }
    if (trimmed.length < 5) {
      setBanError("Deactivation reason must be at least 5 characters.");
      return;
    }
    if (trimmed.length > 500) {
      setBanError("Deactivation reason cannot exceed 500 characters.");
      return;
    }

    setBanError(null);
    onConfirm(profile.id, trimmed);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl border border-border/80 p-7 gap-0 shadow-lg">
        {/* 1. APPROVE MODAL — SUCCESS / DONE STATE */}
        {actionType === "approve" && isApprovedSuccess && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Profile Approved
              </DialogTitle>
            </div>

            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">
                {profile.displayName}&apos;s
              </strong>{" "}
              profile has been successfully approved. The Hosté is now eligible to
              appear on the platform and receive bookings.
            </DialogDescription>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleClose();
                  router.push(`/profiles/${profile.id}`);
                }}
                className="h-9 px-4 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted cursor-pointer"
              >
                View Profile
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {/* 1. APPROVE MODAL — CONFIRMATION */}
        {actionType === "approve" && !isApprovedSuccess && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                Approve this Hosté?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                You&apos;re about to approve{" "}
                <strong className="text-foreground font-semibold">
                  {profile.displayName}&apos;s
                </strong>{" "}
                profile. Once approved, this Hosté will be eligible to appear on the
                platform and receive bookings.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9 px-4 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleApproveSubmit}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Approve Profile</span>
              </Button>
            </div>
          </div>
        )}

        {/* 2. REJECT MODAL WITH INPUT VALIDATION */}
        {actionType === "reject" && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                Reject this Hosté?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Please provide a reason for rejecting{" "}
                <strong className="text-foreground font-semibold">
                  {profile.displayName}&apos;s
                </strong>{" "}
                profile. This information may be shared with the Hosté.
              </DialogDescription>
            </DialogHeader>

            {/* Reason for rejection options */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                REASON FOR REJECTION <span className="text-destructive">*</span>
              </span>

              <div className="space-y-1.5">
                {REJECT_REASONS.map((reason) => {
                  const isSelected = selectedRejectReason === reason;
                  return (
                    <label
                      key={reason}
                      onClick={() => {
                        setSelectedRejectReason(reason);
                        if (rejectError) setRejectError(null);
                      }}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                          : "border-border/80 bg-background hover:bg-muted/40 text-foreground/80"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-muted-foreground/50"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span>{reason}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Additional Notes with character count & error validation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  {selectedRejectReason === "Other" ? (
                    <>
                      SPECIFIC REASON <span className="text-destructive">*</span>
                    </>
                  ) : (
                    "ADDITIONAL NOTES (OPTIONAL)"
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px]",
                    additionalNotes.length > 500
                      ? "text-destructive font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {additionalNotes.length} / 500
                </span>
              </div>
              <Textarea
                placeholder={
                  selectedRejectReason === "Other"
                    ? "Please enter specific details for the rejection (at least 5 characters)..."
                    : "Add specific details or feedback for the applicant..."
                }
                value={additionalNotes}
                onChange={(e) => {
                  setAdditionalNotes(e.target.value);
                  if (rejectError) setRejectError(null);
                }}
                className={cn(
                  "text-xs min-h-[80px] rounded-xl resize-none transition-colors",
                  rejectError
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-border/80",
                )}
              />
              {rejectError && (
                <p className="text-xs text-destructive font-medium flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{rejectError}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9 px-4 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRejectSubmit}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                Reject Profile
              </Button>
            </div>
          </div>
        )}

        {/* 3. RESTORE CONFIRMATION MODAL */}
        {actionType === "restore" && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                Restore this Hosté?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                You&apos;re about to restore{" "}
                <strong className="text-foreground font-semibold">
                  {profile.displayName}&apos;s
                </strong>{" "}
                account. This will allow the Hosté to access the platform and
                receive bookings again.
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9 px-4 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRestoreSubmit}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                Restore Account
              </Button>
            </div>
          </div>
        )}

        {/* 4. SUSPEND CONFIRMATION MODAL WITH INPUT VALIDATION */}
        {actionType === "suspend" && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                Suspend this Hosté?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Suspending this account will temporarily prevent{" "}
                <strong className="text-foreground font-semibold">
                  {profile.displayName}
                </strong>{" "}
                from accessing Hosté and receiving new bookings.
              </DialogDescription>
            </DialogHeader>

            {/* Suspension Duration Options */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                SUSPENSION DURATION
              </span>
              <div className="grid grid-cols-4 gap-2">
                {SUSPEND_DURATIONS.map((d) => {
                  const isSelected = suspendDuration === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSuspendDuration(d.value)}
                      className={cn(
                        "h-8 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                          : "border-border/80 bg-background hover:bg-muted/50 text-muted-foreground",
                      )}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reason for Suspension with character count & error validation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  REASON FOR SUSPENSION <span className="text-destructive">*</span>
                </span>
                <span
                  className={cn(
                    "text-[10px]",
                    suspendReason.length > 500
                      ? "text-destructive font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {suspendReason.length} / 500
                </span>
              </div>
              <Textarea
                placeholder="Enter a reason for this suspension (at least 5 characters)..."
                value={suspendReason}
                onChange={(e) => {
                  setSuspendReason(e.target.value);
                  if (suspendError) setSuspendError(null);
                }}
                className={cn(
                  "text-xs min-h-[90px] rounded-xl resize-none transition-colors",
                  suspendError
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-border/80",
                )}
              />
              {suspendError && (
                <p className="text-xs text-destructive font-medium flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{suspendError}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9 px-4 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSuspendSubmit}
                className="h-9 px-5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
              >
                Suspend Account
              </Button>
            </div>
          </div>
        )}

        {/* 5. BAN / DEACTIVATE MODAL WITH INPUT VALIDATION */}
        {actionType === "ban" && (
          <div className="space-y-5">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="text-base font-bold text-foreground">
                Deactivate this Hosté?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Deactivating this account will permanently remove{" "}
                <strong className="text-foreground font-semibold">
                  {profile.displayName}
                </strong>{" "}
                from public listings and prevent them from receiving new bookings.
              </DialogDescription>
            </DialogHeader>

            {/* Reason for Deactivation */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  REASON FOR DEACTIVATION <span className="text-destructive">*</span>
                </span>
                <span
                  className={cn(
                    "text-[10px]",
                    suspendReason.length > 500
                      ? "text-destructive font-semibold"
                      : "text-muted-foreground",
                  )}
                >
                  {suspendReason.length} / 500
                </span>
              </div>
              <Textarea
                placeholder="Enter reason for deactivating this account (at least 5 characters)..."
                value={suspendReason}
                onChange={(e) => {
                  setSuspendReason(e.target.value);
                  if (banError) setBanError(null);
                }}
                className={cn(
                  "text-xs min-h-[90px] rounded-xl resize-none transition-colors",
                  banError
                    ? "border-destructive focus-visible:ring-destructive/30"
                    : "border-border/80",
                )}
              />
              {banError && (
                <p className="text-xs text-destructive font-medium flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{banError}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="h-9 px-4 text-xs font-semibold rounded-lg border-border/80 text-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleBanSubmit}
                className="h-9 px-5 text-xs font-semibold rounded-lg cursor-pointer shadow-xs"
              >
                Deactivate Account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
