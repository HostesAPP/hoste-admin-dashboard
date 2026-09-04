"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, CheckCircle2, UserPlus, X } from "lucide-react";
import type { Group, GroupMemberRole, GroupMemberStatus } from "@/features/groups";

export type AddMemberDialogProps = {
  group?: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (data: {
    name: string;
    email: string;
    role: GroupMemberRole;
    status: GroupMemberStatus;
  }) => void;
};

// Available platform users to search and add
const AVAILABLE_USERS = [
  {
    userId: "USR-89312",
    name: "Yaw Osei",
    email: "yaw.osei@yahoo.com",
    avatarColor: "#0284C7",
  },
  {
    userId: "USR-12790",
    name: "Emeka Okafor",
    email: "emeka.okafor@example.com",
    avatarColor: "#10B981",
  },
  {
    userId: "USR-44219",
    name: "Blessing Adeleke",
    email: "blessing.a@example.com",
    avatarColor: "#EC4899",
  },
  {
    userId: "USR-67823",
    name: "Tariq Danjuma",
    email: "tariq.d@example.com",
    avatarColor: "#8B5CF6",
  },
  {
    userId: "USR-98311",
    name: "Zainab Bello",
    email: "zainab.bello@example.com",
    avatarColor: "#F59E0B",
  },
];

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  onAddMember,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<(typeof AVAILABLE_USERS)[0] | null>(
    AVAILABLE_USERS[0]
  );
  const [selectedRole, setSelectedRole] = useState<GroupMemberRole>("Member");

  useEffect(() => {

    function reset() {
      setSearchQuery("");
      setSelectedUser(AVAILABLE_USERS[0]);
      setSelectedRole("Member");
    }
    if (!open) {
      reset();
    }
  }, [open]);

  const filteredUsers = AVAILABLE_USERS.filter((user) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.userId.toLowerCase().includes(q)
    );
  });

  const handleConfirm = () => {
    if (selectedUser) {
      onAddMember({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedRole,
        status: "Active",
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md p-6">
        <DialogHeader className="gap-1.5 text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-foreground">
              Add Member to Group
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Search and select a user and assign their role.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Search Input Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or User ID..."
              className="w-full bg-background border-2 border-primary rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-xs"
            />
          </div>

          {/* Search Results List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
            {filteredUsers.map((user) => {
              const isSelected = selectedUser?.userId === user.userId;
              return (
                <div
                  key={user.userId}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary/40"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback
                        style={{
                          backgroundColor: `${user.avatarColor}20`,
                          color: user.avatarColor,
                        }}
                        className="text-xs font-bold"
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm text-foreground leading-none">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {user.email} • {user.userId}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Selection */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold uppercase tracking-wider">
              Assign Group Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                onClick={() => setSelectedRole("Member")}
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${selectedRole === "Member"
                  ? "border-primary bg-primary/5 text-foreground font-semibold"
                  : "border-border hover:bg-muted/40 text-muted-foreground"
                  }`}
              >
                <input
                  type="radio"
                  name="modal-member-role"
                  checked={selectedRole === "Member"}
                  onChange={() => setSelectedRole("Member")}
                  className="accent-primary h-4 w-4"
                />
                <span className="text-sm">Group Member</span>
              </label>

              <label
                onClick={() => setSelectedRole("Co-Leader")}
                className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${selectedRole === "Co-Leader"
                  ? "border-primary bg-primary/5 text-foreground font-semibold"
                  : "border-border hover:bg-muted/40 text-muted-foreground"
                  }`}
              >
                <input
                  type="radio"
                  name="modal-member-role"
                  checked={selectedRole === "Co-Leader"}
                  onChange={() => setSelectedRole("Co-Leader")}
                  className="accent-primary h-4 w-4"
                />
                <span className="text-sm">Group Admin</span>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2.5 pt-4 border-t border-border mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-5 border-border"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5"
            disabled={!selectedUser}
            onClick={handleConfirm}
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
