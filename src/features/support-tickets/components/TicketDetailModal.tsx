// features/support-tickets/components/TicketDetailModal.tsx

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SupportTicket, TicketStatus } from "../types/support-tickets.types";
import { Mail, Phone, Calendar, User, Tag } from "lucide-react";

interface TicketDetailModalProps {
  ticket: SupportTicket | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (ticketId: string, newStatus: TicketStatus) => void;
}

export function TicketDetailModal({
  ticket,
  isOpen,
  onClose,
  onStatusChange,
}: TicketDetailModalProps) {
  const [replyText, setReplyText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!ticket) return null;

  const handleResolve = () => {
    setIsUpdating(true);
    setTimeout(() => {
      onStatusChange?.(ticket.id, "Resolved");
      setIsUpdating(false);
      onClose();
    }, 400);
  };

  const handleInProgress = () => {
    setIsUpdating(true);
    setTimeout(() => {
      onStatusChange?.(ticket.id, "In Progress");
      setIsUpdating(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl rounded-2xl p-6">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-primary tracking-wider uppercase">
              {ticket.ticketCode}
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              {ticket.date}
            </span>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground mt-1">
            {ticket.subject}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Escalated customer support issue from Lade AI
          </DialogDescription>
        </DialogHeader>

        {/* User Info Grid */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border/70 my-2 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-foreground">{ticket.raisedBy}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="w-3.5 h-3.5 text-primary" />
            <span>Category: <strong className="text-foreground">{ticket.type}</strong></span>
          </div>
          {ticket.userEmail && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>{ticket.userEmail}</span>
            </div>
          )}
          {ticket.userPhone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>{ticket.userPhone}</span>
            </div>
          )}
        </div>

        {/* Ticket Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Issue Description
          </label>
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground leading-relaxed">
            {ticket.description || ticket.subject}
          </div>
        </div>

        {/* Quick Resolution Response */}
        <div className="space-y-1.5 mt-2">
          <label className="text-xs font-bold text-foreground">
            Resolution Note / Reply
          </label>
          <textarea
            rows={3}
            placeholder="Add internal notes or customer response message..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-input bg-background focus:ring-1 focus:ring-primary focus:outline-hidden"
          />
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl text-xs"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {ticket.status !== "In Progress" && (
              <Button
                type="button"
                variant="outline"
                disabled={isUpdating}
                onClick={handleInProgress}
                className="rounded-xl text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Mark In Progress
              </Button>
            )}
            {ticket.status !== "Resolved" && (
              <Button
                type="button"
                disabled={isUpdating}
                onClick={handleResolve}
                className="rounded-xl text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Resolve Ticket
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
