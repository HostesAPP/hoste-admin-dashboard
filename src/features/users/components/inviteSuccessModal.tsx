"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface InviteSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email?: string;
}

export function InviteSuccessModal({
  open,
  onOpenChange,
  email = "admin@email.com",
}: InviteSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-6 text-center border-t-4 border-t-primary rounded-xl">
        <div className="flex flex-col items-center pt-2">
          {/* Green checkmark circle */}
          <div className="w-12 h-12 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success mb-4">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>

          <DialogHeader className="text-center space-y-2">
            <DialogTitle className="text-lg font-bold text-foreground">
              Invitation Sent
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              An invitation has been sent to{" "}
              <strong className="text-foreground font-semibold">{email}</strong>
              <br />
              They can use the link in the email to set up their account and access the Hosté Admin Dashboard.
            </DialogDescription>
          </DialogHeader>

          {/* Done Button */}
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm h-10 rounded-lg mt-6 cursor-pointer"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
