// features/customer-support/components/customer-profile/CustomerProfileRightColumn.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  StickyNote,
  Send,
  Ban,
  RotateCcw,
  FileText,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  MoreVertical,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CustomerProfileData } from "../../customer-support.types";

interface CustomerProfileRightColumnProps {
  profile: CustomerProfileData;
  onSendMessage?: () => void;
  onUpdateStatus?: (
    status: CustomerProfileData["customerStatus"],
    reason?: string
  ) => void;
  onAddNote?: (content: string) => void;
  isUpdatingStatus?: boolean;
}

export function CustomerProfileRightColumn({
  profile,
  onSendMessage,
  onUpdateStatus,
  onAddNote,
  isUpdatingStatus = false,
}: CustomerProfileRightColumnProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] =
    useState<CustomerProfileData["customerStatus"]>(profile.customerStatus);
  const [statusReason, setStatusReason] = useState("");
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  const quickActions = [
    {
      id: "add-note",
      label: "Add Internal Note",
      icon: StickyNote,
      onClick: () => setIsAddNoteModalOpen(true),
    },
    {
      id: "push-notification",
      label: "Send push notification",
      icon: Send,
    },
    {
      id: "suspend",
      label: "Suspend customer",
      icon: Ban,
      isDestructive: true,
      onClick: () => onUpdateStatus?.("Suspended", "Manual suspension"),
    },
    {
      id: "reset-password",
      label: "Reset password",
      icon: RotateCcw,
    },
    {
      id: "documents",
      label: "View documents",
      icon: FileText,
    },
    {
      id: "dispute",
      label: "Create dispute",
      icon: AlertTriangle,
      onClick: () => router.push(`/customer-support/${profile.id}/escalate`),
    },
    {
      id: "payment-history",
      label: "View payment histoy",
      icon: Clock,
    },
    {
      id: "more",
      label: "More actions",
      icon: MoreHorizontal,
    },
  ];


  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus?.(selectedStatus, statusReason.trim() || undefined);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onAddNote?.(newNoteContent.trim());
    setNewNoteContent("");
    setIsAddNoteModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Buttons: Send Message + More */}
      <div className="flex items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={onSendMessage}
          className="h-9 px-5 rounded-xl text-xs font-semibold border-border/80 text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        >
          Send message
        </Button>

        <button
          type="button"
          className="h-9 w-9 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
          aria-label="More Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Card 1: Quick Actions */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5">
        <h3 className="text-xs font-bold text-foreground mb-3">Quick Actions</h3>

        <div className="flex flex-col divide-y divide-border/40">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                type="button"
                onClick={action.onClick}
                className="flex items-center gap-2.5 py-2.5 px-1 hover:bg-muted/30 rounded-lg text-left transition-colors cursor-pointer group"
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${action.isDestructive
                      ? "text-destructive"
                      : "text-muted-foreground group-hover:text-foreground"
                    }`}
                />
                <span
                  className={`text-xs font-medium ${action.isDestructive
                      ? "text-destructive font-semibold"
                      : "text-foreground group-hover:text-primary transition-colors"
                    }`}
                >
                  {action.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Card 2: Internal Notes */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-foreground">Internal Notes</h3>
            <button
              type="button"
              onClick={() => setIsAddNoteModalOpen(true)}
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Note</span>
            </button>
          </div>

          <div className="space-y-3">
            {profile.internalNotes.map((note) => {
              const isAmber = note.variant === "amber";
              return (
                <div
                  key={note.id}
                  className={`p-3 rounded-xl border relative flex flex-col justify-between ${
                    isAmber
                      ? "bg-amber-500/10 border-amber-300/50 dark:bg-amber-950/20 dark:border-amber-900/40"
                      : "bg-secondary/10 border-secondary/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-foreground font-medium leading-snug">
                      {note.content}
                    </p>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground p-0.5"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-[10px] text-muted-foreground mt-2">
                    {note.author} . {note.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-8 rounded-md text-xs font-semibold border-border/80 text-primary hover:bg-muted/50 transition-colors cursor-pointer"
        >
          View all Notes
        </Button>
      </div>

      {/* Card 3: Account Status Change Form */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5">
        <h3 className="text-xs font-bold text-foreground mb-3">Account Status</h3>

        <form onSubmit={handleStatusSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <Select
              value={selectedStatus}
              onValueChange={(val) =>
                setSelectedStatus(
                  val as CustomerProfileData["customerStatus"]
                )
              }
            >
              <SelectTrigger className="h-9 rounded-xl text-xs bg-background">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl text-xs">
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="statusReason" className="text-[11px] font-medium text-muted-foreground">
              Reason (Optional)
            </Label>
            <Input
              id="statusReason"
              placeholder="eg. Customer requested a break"
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              className="h-9 rounded-xl text-xs bg-background placeholder:text-muted-foreground/60"
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdatingStatus}
            className="w-full h-9 rounded-xl text-xs font-semibold bg-primary/15 text-primary hover:bg-primary/25 transition-colors cursor-pointer border border-primary/20 shadow-none"
          >
            {isUpdatingStatus ? "Updating..." : "Update status"}
          </Button>
        </form>
      </div>

      {/* Add Note Modal */}
      <Dialog open={isAddNoteModalOpen} onOpenChange={setIsAddNoteModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Add Internal Note
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleNoteSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="noteText" className="text-xs font-semibold">
                Note Content *
              </Label>
              <Textarea
                id="noteText"
                placeholder="Type your internal note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                required
                rows={4}
                className="rounded-xl text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="h-9 rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!newNoteContent.trim()}
                className="h-9 rounded-xl text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Add Note
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
