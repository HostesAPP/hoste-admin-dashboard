export default function ReferralsLoading() {
  return (
    <div
      className="min-w-[1024px] p-8"
      role="status"
      aria-label="Loading referrals"
    >
      <div className="h-10 w-72 animate-pulse rounded-md bg-muted" />
      <div className="mt-8 grid grid-cols-6 gap-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="mt-5 h-36 animate-pulse rounded-lg bg-muted" />
      <div className="mt-5 grid grid-cols-[1.7fr_1fr] gap-5">
        <div className="h-80 animate-pulse rounded-lg bg-muted" />
        <div className="h-80 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
