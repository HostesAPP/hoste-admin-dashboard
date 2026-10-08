import Link from "next/link";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Booking } from "@/features/bookings/bookings.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PaymentTable({ bookings = [] }: { bookings?: Booking[] }) {
  return (
    <div className="rounded-xl border border-border/80 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="text-xs font-bold text-foreground">
              Booking Code
            </TableHead>
            <TableHead className="text-xs font-bold text-foreground">
              Customer
            </TableHead>
            <TableHead className="text-xs font-bold text-foreground">
              Host / Brand
            </TableHead>
            <TableHead className="text-xs font-bold text-foreground">
              Event & Date
            </TableHead>
            <TableHead className="text-xs font-bold text-foreground">
              Total Amount
            </TableHead>
            <TableHead className="text-xs font-bold text-foreground">
              Status
            </TableHead>
            <TableHead className="text-xs font-bold text-foreground">
              Payment
            </TableHead>
            <TableHead className="text-xs font-bold text-foreground text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-10 text-xs text-muted-foreground"
              >
                No bookings found matching your filters.
              </TableCell>
            </TableRow>
          ) : (
            bookings.map((booking) => (
              <TableRow
                key={booking.id}
                className="hover:bg-muted/20 transition-colors"
              >
                <TableCell className="font-bold text-xs text-primary">
                  <Link
                    href={`/bookings/${booking.id}`}
                    className="hover:underline"
                  >
                    {booking.bookingCode}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      {booking.customerName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {booking.customerEmail}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      {booking.hostName}
                    </span>
                    {booking.brandName && (
                      <span className="text-[10px] text-muted-foreground">
                        {booking.brandName}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">
                      {booking.eventName}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {booking.eventDate} ({booking.location})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-bold text-foreground">
                  ₦{booking.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} />
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold ${
                      booking.paymentStatus === "Paid"
                        ? "text-emerald-600"
                        : booking.paymentStatus === "Refunded"
                          ? "text-muted-foreground"
                          : "text-amber-600"
                    }`}
                  >
                    {booking.paymentStatus}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
