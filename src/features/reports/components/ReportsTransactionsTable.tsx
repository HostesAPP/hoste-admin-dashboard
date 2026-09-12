"use client";

import React from "react";
import { MoreHorizontal, Eye, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReportTransaction } from "../types/reports.types";

interface ReportsTransactionsTableProps {
  transactions: ReportTransaction[];
  onViewDetails: (txn: ReportTransaction) => void;
}

export const ReportsTransactionsTable: React.FC<ReportsTransactionsTableProps> = ({
  transactions,
  onViewDetails,
}) => {
  const getStatusBadge = (status: ReportTransaction["status"]) => {
    switch (status) {
      case "Successful":
        return (
          <div className="inline-flex items-center gap-1.5 text-secondary text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>Successful</span>
          </div>
        );
      case "Pending":
        return (
          <div className="inline-flex items-center gap-1.5 text-amber-500 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Pending</span>
          </div>
        );
      case "Refunded":
        return (
          <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Refunded</span>
          </div>
        );
      case "Failed":
        return (
          <div className="inline-flex items-center gap-1.5 text-destructive text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span>Failed</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/80 bg-card shadow-soft">
      <table className="w-full text-left border-collapse min-w-237.5">
        <thead>
          <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <th className="py-3.5 px-4">TXN ID</th>
            <th className="py-3.5 px-4">CUSTOMER / BRAND</th>
            <th className="py-3.5 px-4">BOOKING TYPE</th>
            <th className="py-3.5 px-4">AMOUNT (₦)</th>
            <th className="py-3.5 px-4">COMMISSION</th>
            <th className="py-3.5 px-4">METHOD</th>
            <th className="py-3.5 px-4">STATUS</th>
            <th className="py-3.5 px-4">DATE</th>
            <th className="py-3.5 px-4 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-12 text-center text-muted-foreground">
                No transactions found matching your criteria.
              </td>
            </tr>
          ) : (
            transactions.map((txn) => (
              <tr
                key={txn.id}
                className="hover:bg-muted/30 transition-colors"
              >
                {/* TXN ID */}
                <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                  {txn.txnId}
                </td>

                {/* CUSTOMER / BRAND */}
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">
                      {txn.customerName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {txn.customerType} • {txn.bookingId}
                    </span>
                  </div>
                </td>

                {/* BOOKING TYPE */}
                <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">
                  {txn.bookingType}
                </td>

                {/* AMOUNT */}
                <td className="py-4 px-4 font-extrabold text-foreground whitespace-nowrap">
                  {txn.amount}
                </td>

                {/* COMMISSION */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {txn.status === "Successful" ? (
                    <span className="text-secondary font-bold">
                      {txn.commission} {txn.commissionPercentage && `(${txn.commissionPercentage})`}
                    </span>
                  ) : txn.isReversed ? (
                    <span className="text-muted-foreground font-medium">
                      ₦0 (Reversed)
                    </span>
                  ) : (
                    <span className="text-muted-foreground font-medium">
                      ₦0
                    </span>
                  )}
                </td>

                {/* METHOD */}
                <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                  {txn.paymentMethod}
                </td>

                {/* STATUS */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {getStatusBadge(txn.status)}
                </td>

                {/* DATE */}
                <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                  {txn.date}
                </td>

                {/* ACTION */}
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 rounded-xl">
                      <DropdownMenuItem
                        onClick={() => onViewDetails(txn)}
                        className="cursor-pointer text-xs flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>View Transaction Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          // Can navigate to booking details
                        }}
                        className="cursor-pointer text-xs flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>View Booking ({txn.bookingId})</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
