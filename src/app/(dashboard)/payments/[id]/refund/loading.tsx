export default function LoadingRefund() {
  return (
    <div role="status" aria-label="Loading refund" className="space-y-6 p-8">
      <div className="h-16 animate-pulse rounded-lg bg-muted" />
      <div className="h-96 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
