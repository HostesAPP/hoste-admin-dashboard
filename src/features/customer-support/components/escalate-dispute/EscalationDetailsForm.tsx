// features/customer-support/components/escalate-dispute/EscalationDetailsForm.tsx

"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  Plus,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DisputeAttachment,
  DisputeIssueCategory,
  DisputePriorityLevel,
  EscalateDisputePayload,
} from "../../customer-support.types";
import { MOCK_DISPUTE_DEFAULT_DATA } from "../../data/customer-support.data";
import { useEscalateToDispute } from "../../hooks/customer-support.hooks";

interface EscalationDetailsFormProps {
  conversationId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EscalationDetailsForm({
  conversationId,
  onSuccess,
  onCancel,
}: EscalationDetailsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const escalateMutation = useEscalateToDispute();

  // Form State
  const [issueCategory, setIssueCategory] = useState<DisputeIssueCategory>(
    MOCK_DISPUTE_DEFAULT_DATA.issueCategory
  );
  const [priorityLevel, setPriorityLevel] = useState<DisputePriorityLevel>(
    MOCK_DISPUTE_DEFAULT_DATA.priorityLevel
  );
  const [reason, setReason] = useState(MOCK_DISPUTE_DEFAULT_DATA.reasonForEscalation);
  const [triedSoFar, setTriedSoFar] = useState(MOCK_DISPUTE_DEFAULT_DATA.triedSoFar);
  const [attachments, setAttachments] = useState<DisputeAttachment[]>(
    MOCK_DISPUTE_DEFAULT_DATA.attachments
  );
  const [assignedTeam, setAssignedTeam] = useState(
    MOCK_DISPUTE_DEFAULT_DATA.assignedTeam
  );
  const [internalNote, setInternalNote] = useState(
    MOCK_DISPUTE_DEFAULT_DATA.internalNote
  );
  const [notifyCustomer, setNotifyCustomer] = useState(
    MOCK_DISPUTE_DEFAULT_DATA.notifyCustomer
  );
  const [isDragging, setIsDragging] = useState(false);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    const newAttachments: DisputeAttachment[] = files.map((file, idx) => {
      const isImg = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `file-${Date.now()}-${idx}`,
        name: file.name,
        size: sizeFormatted,
        type: isImg ? "image" : isPdf ? "pdf" : "other",
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files?.length) return;

    const files = Array.from(e.dataTransfer.files);
    const newAttachments: DisputeAttachment[] = files.map((file, idx) => {
      const isImg = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      return {
        id: `file-${Date.now()}-${idx}`,
        name: file.name,
        size: sizeFormatted,
        type: isImg ? "image" : isPdf ? "pdf" : "other",
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const payload: EscalateDisputePayload = {
      conversationId,
      issueCategory,
      priorityLevel,
      reasonForEscalation: reason.trim(),
      triedSoFar: triedSoFar.trim() || undefined,
      attachments,
      assignedTeam,
      internalNote: internalNote.trim() || undefined,
      notifyCustomer,
    };

    escalateMutation.mutate(payload, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(`/customer-support/${conversationId}`);
        }
      },
    });
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 space-y-6"
    >
      <h2 className="text-sm font-bold text-foreground">Escalation Details</h2>

      {/* Row 1: Issue Category & Priority Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Issue Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <span>Issue Category</span>
            <span className="text-destructive">*</span>
          </label>
          <Select
            value={issueCategory}
            onValueChange={(val) => val && setIssueCategory(val as DisputeIssueCategory)}
          >
            <SelectTrigger className="w-full h-10 rounded-xl border-border/80 bg-background text-xs font-medium focus:ring-primary/20">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="Payout Issue">Payout Issue</SelectItem>
              <SelectItem value="Booking Cancellation">Booking Cancellation</SelectItem>
              <SelectItem value="Payment Discrepancy">Payment Discrepancy</SelectItem>
              <SelectItem value="Service Quality">Service Quality</SelectItem>
              <SelectItem value="Fraud Suspected">Fraud Suspected</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Level */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1">
            <span>Priority Level</span>
            <span className="text-destructive">*</span>
          </label>
          <Select
            value={priorityLevel}
            onValueChange={(val) => val && setPriorityLevel(val as DisputePriorityLevel)}
          >
            <SelectTrigger className="w-full h-10 rounded-xl border-border/80 bg-background text-xs font-medium focus:ring-primary/20">
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border">
              <SelectItem value="Urgent">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive shrink-0" />
                  <span>Urgent</span>
                </div>
              </SelectItem>
              <SelectItem value="High">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span>High</span>
                </div>
              </SelectItem>
              <SelectItem value="Medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                  <span>Medium</span>
                </div>
              </SelectItem>
              <SelectItem value="Low">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span>Low</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Reason for Escalation */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
          <span>Reason for Escalation</span>
          <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <textarea
            rows={4}
            value={reason}
            maxLength={1000}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this issue needs dispute escalation..."
            className="w-full rounded-xl border border-border/80 bg-background p-3.5 pb-6 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none"
            required
          />
          <span className="absolute bottom-2.5 right-3 text-[11px] text-muted-foreground/80 font-medium">
            {reason.length}/1000
          </span>
        </div>
      </div>

      {/* Row 3: What has been tried so far? */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          What has been tried so far?
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={triedSoFar}
            maxLength={1000}
            onChange={(e) => setTriedSoFar(e.target.value)}
            placeholder="Document all troubleshooting and support actions already attempted..."
            className="w-full rounded-xl border border-border/80 bg-background p-3.5 pb-6 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none"
          />
          <span className="absolute bottom-2.5 right-3 text-[11px] text-muted-foreground/80 font-medium">
            {triedSoFar.length}/1000
          </span>
        </div>
      </div>

      {/* Row 4: Attach Evidence (Optional) */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-foreground">
          Attach Evidence (Optional)
        </label>

        {/* Dropzone Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40 ${
            isDragging ? "border-primary bg-primary/5" : "border-border/80"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".jpg,.jpeg,.png,.pdf,.mp4"
            className="hidden"
          />
          <UploadCloud className="w-7 h-7 text-muted-foreground mb-2" />
          <p className="text-xs font-semibold text-foreground">
            Drag and drop files here or click to upload
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Supports: JPG, PNG, PDF, MP4 (Max. 10MB) each
          </p>
        </div>

        {/* Uploaded File Cards */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2.5 bg-background border border-border/80 rounded-xl px-3 py-2 text-xs shadow-2xs"
              >
                <div className="p-1.5 rounded-lg bg-muted/60 text-muted-foreground shrink-0">
                  {file.type === "pdf" ? (
                    <FileText className="w-4 h-4 text-destructive" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                  )}
                </div>

                <div className="min-w-0 pr-1">
                  <p className="font-semibold text-foreground text-xs truncate max-w-[140px]">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{file.size}</p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveAttachment(file.id);
                  }}
                  className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
                  title="Remove file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add more files link */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors cursor-pointer pt-0.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add more files</span>
        </button>
      </div>

      {/* Row 5: Assign to Dispute Team */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1">
          <span>Assign to Dispute Team</span>
          <span className="text-destructive">*</span>
        </label>
        <Select value={assignedTeam} onValueChange={(val) => val && setAssignedTeam(val)}>
          <SelectTrigger className="w-full h-10 rounded-xl border-border/80 bg-background text-xs font-medium focus:ring-primary/20">
            <SelectValue placeholder="Assign Dispute Team" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border">
            <SelectItem value="Assign to Dispute Team A">
              Assign to Dispute Team A
            </SelectItem>
            <SelectItem value="Assign to Dispute Team B">
              Assign to Dispute Team B
            </SelectItem>
            <SelectItem value="Financial Disputes Unit">
              Financial Disputes Unit
            </SelectItem>
            <SelectItem value="Host Relations Team">
              Host Relations Team
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Row 6: Internal Note (Visible to admins only) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground">
          Internal Note (Visible to admins only)
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={internalNote}
            maxLength={1000}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder="Add internal context for dispute specialists..."
            className="w-full rounded-xl border border-border/80 bg-background p-3.5 pb-6 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 leading-relaxed resize-none"
          />
          <span className="absolute bottom-2.5 right-3 text-[11px] text-muted-foreground/80 font-medium">
            {internalNote.length}/1000
          </span>
        </div>
      </div>

      {/* Row 7: Bottom Action Row */}
      <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Notify Customer Switch */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={notifyCustomer}
            onClick={() => setNotifyCustomer(!notifyCustomer)}
            className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
              notifyCustomer ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                notifyCustomer ? "translate-x-4.5" : "translate-x-1"
              }`}
            />
          </button>
          <span className="text-xs text-foreground font-medium select-none">
            Send a notification to the customer about this escalation
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelClick}
            disabled={escalateMutation.isPending}
            className="h-10 px-7 rounded-xl text-xs font-semibold border-primary text-primary hover:bg-primary/5 transition-colors cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={escalateMutation.isPending || !reason.trim()}
            className="h-10 px-6 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            {escalateMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Escalating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Escalate Case</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
