"use client";
import { Button } from "@/components/ui/button";
export default function RefundError({ reset }: { reset: () => void }) {
  return (
    <div role="alert" className="space-y-3 p-8">
      <h1 className="text-xl font-semibold">Unable to load this refund</h1>
      <p className="text-sm text-muted-foreground">
        Please try loading the payment again.
      </p>
      <Button variant="outline" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
