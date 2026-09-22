"use client";

import { useState } from "react";
import { MOCK_BOOKINGS, MOCK_BOOKINGS_KPIS } from "../data/bookings.data";
import { Booking, BookingFilterParams, BookingStatus } from "../bookings.types";

export function useBookings(initialFilters?: BookingFilterParams) {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [filters, setFilters] = useState<BookingFilterParams>(initialFilters || {});

  const filteredBookings = bookings.filter((item) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchSearch =
        item.bookingCode.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        item.hostName.toLowerCase().includes(q) ||
        (item.brandName && item.brandName.toLowerCase().includes(q)) ||
        item.eventName.toLowerCase().includes(q);

      if (!matchSearch) return false;
    }

    if (filters.status && filters.status !== "All") {
      if (item.status !== filters.status) return false;
    }

    if (filters.paymentStatus && filters.paymentStatus !== "All") {
      if (item.paymentStatus !== filters.paymentStatus) return false;
    }

    if (filters.startDate) {
      if (new Date(item.eventDate) < new Date(filters.startDate)) return false;
    }

    if (filters.endDate) {
      if (new Date(item.eventDate) > new Date(filters.endDate)) return false;
    }

    return true;
  });

  const updateBookingStatus = (id: string, status: BookingStatus, reason?: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          status,
          ...(status === "Cancelled" && reason ? { cancellationReason: reason } : {}),
          ...(status === "Disputed" && reason ? { disputeReason: reason } : {}),
        };
      })
    );
  };

  return {
    bookings: filteredBookings,
    kpis: MOCK_BOOKINGS_KPIS,
    filters,
    setFilters,
    updateBookingStatus,
    getBookingById: (id: string) => bookings.find((b) => b.id === id || b.bookingCode === id),
  };
}
