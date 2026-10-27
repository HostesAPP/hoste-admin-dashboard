export function referralInDateRange(value: string, dateFrom: string, dateTo: string) {
  const date = value.slice(0, 10);
  return (!dateFrom || date >= dateFrom) && (!dateTo || date <= dateTo);
}
