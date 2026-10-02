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
import { Check, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Profile, ActionType } from "../types/profiles.types";

export type { ActionType };

const REJECT_REASONS = [
  "Invalid or incomplete documents",
  "Verification failed",
  "Inaccurate information",
  "Profile does not meet requirements",
  "Other",
];

interface ProfileActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: ActionType;
  profile: Profile | null;
  onConfirm: (
    profileId: string,
    reason?: string,
    durationDays?: number
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
    REJECT_REASONS[0]
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [isApprovedSuccess, setIsApprovedSuccess] = useState(false);

  if (!profile || !actionType) return null;

  const handleClose = () => {
    setIsApprovedSuccess(false);
    setAdditionalNotes("");
    setSuspendReason("");
    setSelectedRejectReason(REJECT_REASONS[0]);
    onClose();
  };

  const handleApproveSubmit = () => {
    onConfirm(profile.id);
    setIsApprovedSuccess(true);
  };

  const handleRejectSubmit = () => {
    const fullReason = additionalNotes.trim()
      ? `${selectedRejectReason}: ${additionalNotes.trim()}`
      : selectedRejectReason;
    onConfirm(profile.id, fullReason);
    handleClose();
  };

  const handleSuspendSubmit = () => {
    onConfirm(profile.id, suspendReason);
    handleClose();
  };

  const handleRestoreSubmit = () => {
    onConfirm(profile.id);
    handleClose();
  };

  const handleBanSubmit = () => {
    onConfirm(profile.id, suspendReason);
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

        {/* 2. REJECT MODAL */}
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
                REASON FOR REJECTION
              </span>

              <div className="space-y-1.5">
                {REJECT_REASONS.map((reason) => {
                  const isSelected = selectedRejectReason === reason;
                  return (
                    <label
                      key={reason}
                      onClick={() => setSelectedRejectReason(reason)}
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

            {/* Additional Notes */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                ADDITIONAL NOTES (OPTIONAL)
              </span>
              <Textarea
                placeholder="Add specific details or feedback for the applicant..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="text-xs min-h-[80px] rounded-xl resize-none border-border/80"
              />
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

        {/* 4. SUSPEND CONFIRMATION MODAL */}
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

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                REASON FOR SUSPENSION
              </span>
              <Textarea
                placeholder="Enter reason for this action..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                className="text-xs min-h-[90px] rounded-xl resize-none border-border/80"
              />
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

        {/* 5. BAN / DEACTIVATE MODAL */}
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
