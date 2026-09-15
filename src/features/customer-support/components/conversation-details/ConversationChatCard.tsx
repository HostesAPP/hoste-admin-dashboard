// features/customer-support/components/conversation-details/ConversationChatCard.tsx

"use client";

import React, { useState } from "react";
import {
  Star,
  Hexagon,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CustomerConversation,
  CustomerMessage,
} from "../../customer-support.types";

interface ConversationChatCardProps {
  conversation: CustomerConversation;
  onSendMessage: (content: string, isInternalNote?: boolean) => void;
  isSending?: boolean;
  onViewProfile?: () => void;
}

export function ConversationChatCard({
  conversation,
  onSendMessage,
  isSending = false,
  onViewProfile,
}: ConversationChatCardProps) {
  const [activeTab, setActiveTab] = useState<"reply" | "note">("reply");
  const [messageText, setMessageText] = useState("");
  const [isStarred, setIsStarred] = useState(false);

  const messages = conversation.messages || [];

  const handleSend = () => {
    if (!messageText.trim()) return;
    onSendMessage(messageText.trim(), activeTab === "note");
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs flex flex-col overflow-hidden">
      {/* Top Card Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-card">
        {/* Customer User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-border/60">
            {conversation.customerAvatar && (
              <AvatarImage
                src={conversation.customerAvatar}
                alt={conversation.customerName}
              />
            )}
            <AvatarFallback className="bg-muted text-foreground font-bold text-xs">
              {conversation.customerInitial ||
                conversation.customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">
                {conversation.customerName}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            </div>
            <span className="text-[11px] text-muted-foreground">
              {conversation.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Star Icon Button */}
          <button
            type="button"
            onClick={() => setIsStarred(!isStarred)}
            className={`w-8 h-8 rounded-lg border border-border/80 flex items-center justify-center transition-colors cursor-pointer ${
              isStarred
                ? "bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-200"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            <Star className="w-4 h-4" />
          </button>

          {/* Hexagon/Settings Icon Button */}
          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
          >
            <Hexagon className="w-4 h-4" />
          </button>

          {/* More Vertical Icon Button */}
          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* View Profile Solid Orange Button */}
          <Button
            type="button"
            onClick={onViewProfile}
            className="h-8 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer shadow-xs ml-1"
          >
            View Profile
          </Button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="p-6 flex-1 min-h-[380px] max-h-[520px] overflow-y-auto space-y-6 flex flex-col justify-start">
        {/* Date Stamp */}
        <div className="text-center my-1">
          <span className="text-xs text-muted-foreground font-medium px-3 py-1 bg-muted/30 rounded-full">
            Today
          </span>
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isAdmin = msg.senderRole === "Admin";
          const isNote = msg.isInternalNote;

          if (isAdmin) {
            return (
              <div
                key={msg.id}
                className="flex items-end justify-end gap-3 max-w-xl ml-auto"
              >
                {/* Bubble (Peach / Orange Tint) */}
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-amber-100/70 dark:bg-amber-950/40 text-foreground px-4 py-3 rounded-2xl rounded-tr-xs text-xs sm:text-[13px] leading-relaxed border border-amber-200/50 dark:border-amber-900/40 whitespace-pre-line shadow-2xs">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Admin Avatar Circle */}
                <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shrink-0 shadow-xs mb-4">
                  {msg.senderInitial || "SA"}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className="flex items-end justify-start gap-3 max-w-xl mr-auto"
            >
              {/* Customer Avatar */}
              <Avatar className="w-7 h-7 border border-border/60 shrink-0 mb-4">
                {conversation.customerAvatar && (
                  <AvatarImage
                    src={conversation.customerAvatar}
                    alt={conversation.customerName}
                  />
                )}
                <AvatarFallback className="text-[10px] font-bold bg-muted text-foreground">
                  {conversation.customerInitial ||
                    conversation.customerName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Bubble (Light Neutral / Soft Mint Tint) */}
              <div className="flex flex-col items-start gap-1">
                <div className="bg-emerald-50/50 dark:bg-muted/40 text-foreground px-4 py-3 rounded-2xl rounded-tl-xs text-xs sm:text-[13px] leading-relaxed border border-emerald-100/60 dark:border-border/60 whitespace-pre-line shadow-2xs">
                  {msg.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Reply Composer Box */}
      <div className="p-4 border-t border-border/70 bg-card">
        <div className="border border-border/80 rounded-xl overflow-hidden bg-background">
          {/* Tabs: Reply | Note */}
          <div className="flex items-center gap-6 px-4 pt-3 pb-2 border-b border-border/60">
            <button
              type="button"
              onClick={() => setActiveTab("reply")}
              className={`text-xs font-bold pb-1 transition-colors relative cursor-pointer ${
                activeTab === "reply"
                  ? "text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Reply
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("note")}
              className={`text-xs font-semibold pb-1 transition-colors relative cursor-pointer ${
                activeTab === "note"
                  ? "text-primary border-b-2 border-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Note
            </button>
          </div>

          {/* Text Area */}
          <Textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              activeTab === "reply"
                ? "Type your message......"
                : "Type an internal note (only visible to team)..."
            }
            rows={3}
            className="w-full border-none shadow-none focus-visible:ring-0 text-xs sm:text-[13px] resize-none p-4 placeholder:text-muted-foreground/60 bg-transparent"
          />

          {/* Composer Footer: Attachments, Camera, Emoji, Send button */}
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <div className="flex items-center gap-3 text-muted-foreground">
              <button
                type="button"
                className="hover:text-foreground transition-colors p-1 cursor-pointer"
                aria-label="Attach File"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="hover:text-foreground transition-colors p-1 cursor-pointer"
                aria-label="Add Photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="hover:text-foreground transition-colors p-1 cursor-pointer"
                aria-label="Add Emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <Button
              type="button"
              disabled={isSending || !messageText.trim()}
              onClick={handleSend}
              className="h-8 px-5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-1.5 shadow-xs cursor-pointer"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
