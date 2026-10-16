export function formatPayoutDate(value: string | null, includeTime = false) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Lagos",
    ...(includeTime
      ? { hour: "numeric" as const, minute: "2-digit" as const }
      : {}),
  });
}
