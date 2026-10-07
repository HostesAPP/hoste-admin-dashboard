"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckCircle2, Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ReferralReward, RewardReferrer } from "../rewards.types";
import {
  rewardReviewSchema,
  type RewardReviewValues,
} from "../schemas/rewards.filter.schema";
import { RewardStatusBadge } from "./reward.status.badge";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Lagos",
  });
}

export function RewardReviewDrawer({
  reward,
  referrer,
  onClose,
  onReview,
}: {
  reward: ReferralReward;
  referrer?: RewardReferrer;
  onClose: () => void;
  onReview: (
    id: string,
    decision: "Approved" | "Rejected",
    note: string,
  ) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RewardReviewValues>({
    resolver: zodResolver(rewardReviewSchema),
    defaultValues: { note: reward.reviewNote ?? "" },
  });
  const [confirmation, setConfirmation] = useState<{
    decision: "Approved" | "Rejected";
    note: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const requestDecision = (decision: "Approved" | "Rejected") =>
    handleSubmit(({ note }) => {
      setError("");
      setConfirmation({ decision, note });
    })();
  const confirm = async () => {
    if (!confirmation || saving) return;
    setSaving(true);
    try {
      await onReview(reward.id, confirmation.decision, confirmation.note);
      setConfirmation(null);
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save this review. Please try again.",
      );
      setConfirmation(null);
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open && !saving) onClose();
        }}
      >
        <DialogContent className="left-auto right-0 top-0 flex h-dvh w-[400px] max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0 sm:max-w-none">
          <DialogHeader className="border-b border-border p-5 pr-12">
            <DialogTitle className="text-base font-bold">
              {reward.canReview ? "Review Reward" : "Reward Details"}
            </DialogTitle>
            <DialogDescription className="text-[11px]">
              Verify the referral and qualification details before reviewing
              this reward.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 text-[11px]">
            <div className="grid grid-cols-[1fr_1.3fr] rounded-md border border-border bg-muted/30 p-3">
              <div>
                <p className="text-[9px] font-semibold text-muted-foreground">
                  REWARD AMOUNT
                </p>
                <p className="mt-1 text-xl font-bold text-primary">
                  ₦{reward.amount.toLocaleString()}
                </p>
              </div>
              <div className="border-l border-border pl-3">
                <p className="mb-1 text-[9px] font-semibold text-muted-foreground">
                  STATUS
                </p>
                <RewardStatusBadge status={reward.status} />
                <p className="mt-1 text-[9px] text-muted-foreground">
                  Generated: {formatDate(reward.generatedAt)}
                </p>
              </div>
            </div>
            <section>
              <h3 className="mb-2 text-[9px] font-semibold text-muted-foreground">
                PARTICIPANTS
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "REFERRER",
                    name: referrer?.name ?? "—",
                    detail: `Code: ${referrer?.code ?? "—"}`,
                    active: referrer?.active,
                  },
                  {
                    label: "REFERRED USER",
                    name: reward.referredUser,
                    detail: reward.referredEmail || "—",
                    active: reward.referredActive,
                  },
                ].map((participant) => (
                  <div
                    key={participant.label}
                    className="min-w-0 rounded-md border border-border p-3"
                  >
                    <p className="text-[8px] text-muted-foreground">
                      {participant.label}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-primary/10 text-[8px] text-primary">
                          {participant.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p
                          className="truncate text-[10px] font-semibold"
                          title={participant.name}
                        >
                          {participant.name}
                        </p>
                        <p
                          className="truncate text-[8px] text-muted-foreground"
                          title={participant.detail}
                        >
                          {participant.detail}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`mt-2 text-[9px] ${participant.active ? "text-success" : "text-muted-foreground"}`}
                    >
                      {participant.active ? "● Active User" : "Inactive User"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3 className="mb-2 text-[9px] font-semibold text-muted-foreground">
                REFERRAL DETAILS
              </h3>
              <dl className="space-y-2 rounded-md border border-border p-3">
                {[
                  ["Referral Code", referrer?.code ?? "—"],
                  ["Referral ID", reward.referralId],
                  ["Referral Date", formatDate(reward.referralDate)],
                  ["Referral Status", reward.referralStatus],
                  [
                    "Qualification Status",
                    reward.qualificationMet ? "Qualified" : "Pending",
                  ],
                  ["Qualification Date", formatDate(reward.qualifiedAt)],
                  ["Reward Amount", `₦${reward.amount.toLocaleString()}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-3 border-b border-border/40 pb-1 last:border-0"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd
                      className={`text-right text-[10px] font-semibold ${label === "Reward Amount" ? "text-primary" : ""}`}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
            <section>
              <h3 className="mb-2 text-[9px] font-semibold text-muted-foreground">
                QUALIFICATION CHECK
              </h3>
              <div
                className={`flex gap-2 rounded-md border p-3 ${reward.qualificationMet ? "border-success/15 bg-success/10 text-success" : "border-yellow/20 bg-yellow/10 text-warning"}`}
              >
                <CheckCircle2 className="size-4 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold">
                    {reward.qualificationMet
                      ? "Qualification Met"
                      : "Qualification Pending"}
                  </p>
                  <p className="text-[9px]">{reward.qualification}</p>
                </div>
              </div>
            </section>
            <div>
              <Label
                htmlFor="reward-review-note"
                className="text-[9px] font-semibold text-muted-foreground"
              >
                ADMIN REVIEW NOTE
              </Label>
              <Textarea
                id="reward-review-note"
                {...register("note")}
                readOnly={!reward.canReview}
                placeholder="Add a note about this reward review (optional)..."
                className="mt-2 min-h-24 resize-none text-[11px]"
              />
              {errors.note && (
                <p role="alert" className="mt-1 text-destructive">
                  {errors.note.message}
                </p>
              )}
            </div>
            {error && (
              <p role="alert" className="text-destructive">
                {error}
              </p>
            )}
          </div>
          <footer className="flex gap-3 border-t border-border p-4">
            {reward.canReview ? (
              <>
                <Button
                  variant="outline"
                  className="flex-1 border-destructive/40 text-xs text-destructive"
                  disabled={saving}
                  onClick={() => requestDecision("Rejected")}
                >
                  Reject Reward
                </Button>
                <Button
                  className="flex-1 text-xs"
                  disabled={saving || !reward.qualificationMet}
                  onClick={() => requestDecision("Approved")}
                >
                  Approve Reward
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={onClose}
              >
                Close Details
              </Button>
            )}
          </footer>
        </DialogContent>
      </Dialog>
      <Dialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open && !saving) setConfirmation(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[560px]"
        >
          <div className="flex items-start gap-4 px-8 pb-12 pt-8">
            <span
              aria-hidden="true"
              className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
                confirmation?.decision === "Rejected"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {confirmation?.decision === "Rejected" ? (
                <X className="size-6" />
              ) : (
                <Check className="size-6" />
              )}
            </span>
            <DialogHeader className="gap-2 pt-1">
              <DialogTitle className="text-lg font-bold">
                {confirmation?.decision === "Approved"
                  ? "Approve this reward?"
                  : "Reject this reward?"}
              </DialogTitle>
              <DialogDescription>
                This will{" "}
                {confirmation?.decision === "Approved" ? "approve" : "reject"}{" "}
                the{" "}
                <strong className="font-semibold text-foreground">
                  ₦{reward.amount.toLocaleString()}
                </strong>{" "}
                referral reward for {referrer?.name ?? "this referrer"}
                {confirmation?.decision === "Approved"
                  ? " and allow it to proceed to the next stage of the payout process."
                  : ". It will not proceed to the next stage of the payout process."}
              </DialogDescription>
            </DialogHeader>
          </div>
          <footer className="flex justify-end gap-6 border-t border-border px-6 pb-12 pt-6">
            <Button
              variant="outline"
              className="h-10 min-w-28"
              disabled={saving}
              onClick={() => setConfirmation(null)}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmation?.decision === "Rejected"
                  ? "destructive"
                  : "default"
              }
              disabled={saving}
              onClick={confirm}
              className="h-10 px-5"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              {saving
                ? "Saving..."
                : confirmation?.decision === "Approved"
                  ? "Approve Reward"
                  : "Reject Reward"}
            </Button>
          </footer>
        </DialogContent>
      </Dialog>
    </>
  );
}
