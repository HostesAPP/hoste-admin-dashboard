"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export interface LogoutModalProps {
  open?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  isPending?: boolean;
}

export function LogoutModal({
  open,
  isOpen,
  onOpenChange,
  onClose,
  onConfirm,
  isLoading,
  isPending,
}: LogoutModalProps) {
  const isModalOpen = open !== undefined ? open : isOpen ?? false;
  const loading = isLoading ?? isPending ?? false;

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen);
    }
    if (!nextOpen && onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-107.5 p-7 rounded-[22px] bg-card border border-border/70 shadow-2xl gap-0"
        showCloseButton={true}
      >
        <div className="pr-6">
          <DialogTitle className="text-xl font-bold text-foreground tracking-tight leading-snug">
            Are you sure you want to log out?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed mt-2.5">
            You&apos;ll need to sign in again to access your Hosté dashboard.
          </DialogDescription>
        </div>

        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="h-10 px-5 rounded-xl border border-border/80 bg-background text-sm font-semibold text-foreground hover:bg-muted/60 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-sm font-semibold text-primary-foreground shadow-xs transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Logging out...</span>
              </>
            ) : (
              <span>Log Out</span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutModal;

