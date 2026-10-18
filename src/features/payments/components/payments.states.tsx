"use client";

import Link from "next/link";
import { CircleAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentIllustration({ error = false }: { error?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 220" className="mb-5 h-[220px] w-[300px] text-foreground" fill="none">
      <path d="M18 205h264" stroke="currentColor" strokeWidth="1.8" />
      {error ? (
        <>
          <path d="m150 18 60 28v63c0 39-33 65-60 80-27-15-60-41-60-80V46z" className="fill-yellow/10" stroke="currentColor" strokeWidth="2" />
          <path d="m150 31 48 23v54c0 31-25 53-48 67-23-14-48-36-48-67V54z" className="fill-primary/5" />
          <g transform="rotate(-16 150 90)">
            <path d="M108 76h23m40 37h25" stroke="currentColor" strokeWidth="2" />
            <rect x="122" y="65" width="22" height="25" rx="4" fill="currentColor" />
            <rect x="165" y="99" width="22" height="25" rx="4" className="fill-primary" stroke="currentColor" strokeWidth="1.5" />
          </g>
          <circle cx="150" cy="65" r="15" className="fill-primary" stroke="currentColor" strokeWidth="1.5" />
          <path d="M150 57v9m0 6v1" stroke="var(--primary-foreground)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="m55 57 15 16m0-16L55 73m174-4 12 12m0-12-12 12" className="stroke-primary" strokeWidth="1.8" />
          <path d="M52 160c-12-22-16-6-22 7 13 16 21 12 22-7Z" className="fill-secondary" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="251" cy="179" r="4" className="fill-secondary" />
        </>
      ) : (
        <>
          <path d="m99 148 10 57h20l-8-57m57-3-9 60h20l10-60" className="fill-card" stroke="currentColor" strokeWidth="1.6" />
          <rect x="97" y="143" width="112" height="10" rx="3" className="fill-yellow/10" stroke="currentColor" strokeWidth="1.5" />
          <g transform="rotate(-13 139 99)">
            <rect x="38" y="36" width="184" height="118" rx="12" className="fill-yellow/10" stroke="currentColor" strokeWidth="2" />
            <path d="M38 62h184v23H38z" className="fill-primary" stroke="currentColor" strokeWidth="1.7" />
            <path d="M62 107h40" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
            <path d="M62 120h58m-58 10h28" className="stroke-foreground/10" strokeWidth="5" strokeLinecap="round" />
            <circle cx="183" cy="119" r="12" className="fill-primary" stroke="currentColor" />
            <circle cx="193" cy="119" r="12" className="fill-secondary" stroke="currentColor" />
            <ellipse cx="194" cy="131" rx="16" ry="11" className="fill-primary" stroke="currentColor" strokeWidth="1.5" />
          </g>
          <ellipse cx="224" cy="61" rx="14" ry="21" className="fill-primary" stroke="currentColor" strokeWidth="1.6" />
          <ellipse cx="224" cy="61" rx="9" ry="15" stroke="var(--primary-foreground)" />
          <path d="M229 29c12-22 16-13 22-1-10 13-16 12-22 1Z" className="fill-secondary" stroke="currentColor" strokeWidth="1.6" />
          <path d="m29 184 4 21h19l4-21Zm13-5c-3-11-12-14-18-13m18 13c2-10 7-14 13-18" className="fill-primary" stroke="currentColor" strokeWidth="1.8" />
        </>
      )}
    </svg>
  );
}

export function PaymentsEmptyState() {
  return (
    <section role="status" className="flex min-h-[650px] flex-col items-center justify-center px-6 pb-16 text-center tracking-normal">
      <PaymentIllustration />
      <h2 className="text-2xl font-bold">No transactions yet</h2>
      <p className="mt-4 max-w-[470px] text-sm leading-6 text-muted-foreground">
        Transactions will appear here once your customers start making payments for bookings. Keep managing your properties to drive more reservations!
      </p>
      <Button className="mt-7 h-11 px-6" nativeButton={false} render={<Link href="/" />}>View Dashboard</Button>
    </section>
  );
}

export function PaymentsErrorState({ message, onRetry, retrying = false }: { message: string; onRetry: () => void; retrying?: boolean }) {
  return (
    <>
      <div role="alert" className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm tracking-normal">
        <CircleAlert className="size-5 shrink-0 text-primary" />
        <p><strong className="font-semibold">Connection Interrupted:</strong> <span className="text-muted-foreground">We could not sync the latest transactions with the payment server. {message}</span></p>
      </div>
      <section className="flex min-h-[650px] flex-col items-center justify-center px-6 pb-16 text-center tracking-normal">
        <PaymentIllustration error />
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">We couldn&apos;t load your transaction data right now.<br />Please check your network connection or try refreshing the page.</p>
        <div className="mt-8 flex gap-10">
          <Button onClick={onRetry} disabled={retrying} className="h-11 min-w-32 gap-2 px-5"><RefreshCw className={`size-4 ${retrying ? "animate-spin" : ""}`} />{retrying ? "Retrying..." : "Try Again"}</Button>
          <Button variant="outline" className="h-11 min-w-28 bg-muted px-5" nativeButton={false} render={<Link href="/customer-support" />}>Get Help</Button>
        </div>
      </section>
    </>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-foreground/10 motion-safe:animate-pulse ${className}`} />;
}

export function PaymentsLoadingState() {
  return (
    <section role="status" aria-label="Loading payments" aria-busy="true" className="space-y-6 py-8 tracking-normal">
      <span className="sr-only">Loading payments overview and transactions</span>
      <div className="flex items-center gap-3" aria-hidden="true">
        <Skeleton className="h-10 w-72" /><Skeleton className="h-10 w-36" /><Skeleton className="h-10 w-32" /><Skeleton className="ml-auto h-10 w-24" />
      </div>
      <div className="grid grid-cols-4 gap-4" aria-hidden="true">
        {["Total Payments", "Successful", "Pending", "Failed"].map((label) => (
          <div key={label} className="rounded-lg border border-border bg-muted/40 p-5">
            <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
            <Skeleton className="mt-4 h-7 w-28" /><Skeleton className="mt-3 h-2 w-20" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-lg border border-border" aria-hidden="true">
        <div className="grid grid-cols-8 gap-5 bg-muted px-5 py-4">
          {["Transaction ID", "Customer", "Booking ID", "Amount", "Method", "Status", "Date", "Actions"].map((label) => <span key={label} className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</span>)}
        </div>
        {Array.from({ length: 7 }, (_, row) => (
          <div key={row} className="grid h-[68px] grid-cols-8 items-center gap-5 border-t border-border bg-muted/20 px-5">
            {Array.from({ length: 8 }, (_, cell) => <Skeleton key={cell} className={`${cell === 5 ? "h-5 rounded-full" : "h-2.5"} ${((row + cell) % 3) === 0 ? "w-3/4" : "w-full"}`} />)}
          </div>
        ))}
      </div>
      <div className="flex justify-between" aria-hidden="true"><Skeleton className="h-2 w-40" /><div className="flex gap-2"><Skeleton className="size-7" /><Skeleton className="size-7" /><Skeleton className="size-7" /></div></div>
    </section>
  );
}
