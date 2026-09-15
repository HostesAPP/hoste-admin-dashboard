// features/support-tickets/components/ticket-details/TicketConversationThread.tsx

"use client";

import React, { useState } from "react";
import {
  Paperclip,
  Zap,
  Lock,
  Send,
  Smile,
  ChevronDown,
} from "lucide-react";
import { SupportTicket, TicketMessage } from "../../types/support-tickets.types";

interface TicketConversationThreadProps {
  ticket: SupportTicket;
  onSendMessage?: (message: Partial<TicketMessage>) => void;
}

export function TicketConversationThread({
  ticket,
  onSendMessage,
}: TicketConversationThreadProps) {
  const [activeTab, setActiveTab] = useState<
    "conversation" | "notes" | "history"
  >("conversation");
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);

  const messages = ticket.messages || [];

  const handleSend = () => {
    if (!replyText.trim()) return;

    onSendMessage?.({
      senderName: "Naomi Sarah",
      senderRole: "Admin",
      senderInitial: "N",
      timestamp: "Just now",
      isInternalNote,
      content: replyText.trim(),
    });

    setReplyText("");
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xs flex flex-col gap-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-border/70 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("conversation")}
          className={`text-xs sm:text-sm font-semibold pb-3 -mb-3 transition-colors relative cursor-pointer ${
            activeTab === "conversation"
              ? "text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Conversation
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold pb-3 -mb-3 transition-colors cursor-pointer ${
            activeTab === "notes"
              ? "text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Internal Notes</span>
          <span className="w-4 h-4 rounded-full bg-muted text-[10px] flex items-center justify-center font-bold">
            3
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`text-xs sm:text-sm font-semibold pb-3 -mb-3 transition-colors cursor-pointer ${
            activeTab === "history"
              ? "text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          History
        </button>
      </div>

      {/* Message Feed */}
      <div className="flex flex-col gap-6">
        {messages.map((msg) => {
          const isCustomer = msg.senderRole === "Customer";

          return (
            <div key={msg.id} className="flex items-start gap-4">
              {/* Avatar circle with initial */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-xs ${
                  isCustomer ? "bg-emerald-800" : "bg-orange-600"
                }`}
              >
                {msg.senderInitial || msg.senderName.charAt(0)}
              </div>

              {/* Message Content Body */}
              <div className="flex-1 flex flex-col">
                {/* Header info */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-foreground">
                    {msg.senderName}
                  </span>

                  {isCustomer ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Customer
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100/80 text-orange-800 border border-orange-200/60 dark:bg-orange-950/40 dark:text-orange-300">
                      Admin
                    </span>
                  )}

                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp}
                  </span>

                  {msg.isInternalNote && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200/60 dark:bg-orange-950/40 dark:text-orange-300">
                      <Lock className="w-2.5 h-2.5" />
                      Internal Note
                    </span>
                  )}
                </div>

                {/* Optional Subject */}
                {msg.subject && (
                  <p className="font-bold text-xs sm:text-sm text-foreground mt-2">
                    {msg.subject}
                  </p>
                )}

                {/* Body paragraph */}
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply Input Box */}
      <div className="border border-primary/40 bg-background rounded-2xl p-4 shadow-xs mt-2 focus-within:border-primary transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center font-bold text-xs text-white shrink-0 mt-1">
            N
          </div>
          <textarea
            rows={3}
            placeholder="Type your reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-hidden resize-none placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-2">
          {/* Action icons */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
              title="Add Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 rounded-lg hover:bg-muted/70 hover:text-foreground transition-colors cursor-pointer"
              title="Insert Macro"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>

          {/* Note Toggle & Send Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsInternalNote(!isInternalNote)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                isInternalNote
                  ? "bg-orange-100 text-orange-800 border-orange-300"
                  : "bg-muted/30 text-muted-foreground border-border/70 hover:text-foreground"
              }`}
            >
              <Lock className="w-3 h-3 text-orange-600" />
              <span>Internal Note</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={handleSend}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900 hover:bg-emerald-950 text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
            >
              <span>Send Reply</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
