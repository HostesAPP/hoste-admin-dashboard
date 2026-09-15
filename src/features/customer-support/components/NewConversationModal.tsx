// features/customer-support/components/NewConversationModal.tsx

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConversationChannel } from "../customer-support.types";

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    channel: ConversationChannel;
    message: string;
  }) => void;
  isLoading?: boolean;
}

export function NewConversationModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: NewConversationModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [channel, setChannel] = useState<ConversationChannel>("Chat");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !message.trim()) return;

    onSubmit({
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      channel,
      message: message.trim(),
    });

    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Start New Conversation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="customerName" className="text-xs font-semibold">
              Customer Name *
            </Label>
            <Input
              id="customerName"
              placeholder="e.g. Sarah Johnson"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="h-10 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="customerEmail" className="text-xs font-semibold">
                Customer Email
              </Label>
              <Input
                id="customerEmail"
                type="email"
                placeholder="sarah@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="channel" className="text-xs font-semibold">
                Channel
              </Label>
              <Select
                value={channel}
                onValueChange={(val) => setChannel(val as ConversationChannel)}
              >
                <SelectTrigger id="channel" className="h-10 rounded-xl text-xs">
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent className="rounded-xl text-xs">
                  <SelectItem value="Chat">Chat</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Mobile App">Mobile App</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message" className="text-xs font-semibold">
              Initial Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Type message content or customer inquiry..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={3}
              className="rounded-xl text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !customerName.trim() || !message.trim()}
              className="h-10 rounded-xl text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {isLoading ? "Starting..." : "Start Conversation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
