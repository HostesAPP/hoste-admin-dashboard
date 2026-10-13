import type { RefundReceipt } from "./types/transactions.types";

export const RECEIPT_METHODS = {
  CREDIT_CARD: "Credit Card",
  BANK_TRANSFER: "Bank Transfer",
  PAYPAL: "PayPal",
};
export const receiptMoney = (amount: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    amount,
  );
export const receiptDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });
export const receiptFilename = (receipt: RefundReceipt) =>
  `Refund_Receipt_${receipt.reference.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
export const receiptRows = (receipt: RefundReceipt) => [
  {
    description: "Original Amount Paid",
    method: RECEIPT_METHODS[receipt.method],
    amount: receiptMoney(receipt.amountPaid),
  },
  {
    description: "Requested Refund Amount",
    method: "Refund request",
    amount: receiptMoney(receipt.amount),
  },
  {
    description: "Processing Fee Deduction",
    method: "Quoted fee",
    amount: `${receipt.processingFee > 0 ? "-" : ""}${receiptMoney(receipt.processingFee)}`,
  },
];
export type ReceiptTheme = {
  primary: string;
  secondary: string;
  text: string;
  muted: string;
  border: string;
  surface: string;
  background: string;
};
export function readReceiptTheme(): ReceiptTheme {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => {
    const value = style.getPropertyValue(name).trim();
    if (!/^#[0-9a-f]{6}$/i.test(value))
      throw new Error("Receipt theme is unavailable.");
    return value;
  };
  return {
    primary: read("--primary"),
    secondary: read("--secondary"),
    text: read("--foreground"),
    muted: read("--muted-foreground"),
    border: read("--border"),
    surface: read("--muted"),
    background: read("--card"),
  };
}
const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
export function createRefundReceiptHtml(
  receipt: RefundReceipt,
  theme?: ReceiptTheme,
) {
  const e = escapeHtml;
  const booking = receipt.booking;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Refund Preview Receipt</title><style>
  @font-face{font-family:Receipt;src:url('/fonts/dejavu-sans.ttf')}@font-face{font-family:Receipt;src:url('/fonts/dejavu-sans-bold.ttf');font-weight:700}
  :root{--text:${theme?.text ?? "CanvasText"};--muted:${theme?.muted ?? "GrayText"};--green:${theme?.secondary ?? "CanvasText"};--orange:${theme?.primary ?? "CanvasText"};--border:${theme?.border ?? "GrayText"};--surface:${theme?.surface ?? "Canvas"};--paper:${theme?.background ?? "Canvas"}}
  *{box-sizing:border-box}body{font:12px Receipt,system-ui,sans-serif;color:var(--text);background:var(--paper);margin:0}article{max-width:794px;margin:auto;padding:48px}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:24px}.brand{font-size:20px;font-weight:700}h1{font-size:20px;margin:0}h2{font-size:14px;margin:0}.muted{color:var(--muted);font-size:11px}.issued{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:24px 0}dl{margin:0}dl>div{display:flex;justify-content:space-between;gap:16px;margin-bottom:8px}dd{margin:0;font-weight:700;overflow-wrap:anywhere;text-align:right}dt{color:var(--muted)}p{line-height:1.5;margin:4px 0}.booking{background:var(--surface);padding:16px;margin:24px 0;line-height:1.7}table{border-collapse:collapse;width:100%;margin:24px 0}th,td{padding:13px;border-bottom:1px solid var(--border);text-align:left;font-size:11px;overflow-wrap:anywhere}th{background:var(--surface);color:var(--muted)}td:last-child,th:last-child{text-align:right}td:first-child,td:last-child{font-weight:700}.net{display:flex;justify-content:space-between;align-items:center;margin:24px 0}.amount{font-size:22px;font-weight:700;color:var(--green)}.destination{background:var(--surface);border:1px solid var(--border);padding:18px;color:var(--green);margin:24px 0}footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid var(--border);padding-top:24px;margin-top:32px}.stamp{border:1px dashed var(--orange);color:var(--orange);padding:12px 24px;text-align:center;font-size:10px}.note{margin-top:28px;text-align:center;font-size:10px;color:var(--muted)}@page{size:A4;margin:0}@media print{article{max-width:none;padding:16mm}header,.issued,.booking,.destination,footer{break-inside:avoid}}
  </style></head><body><article><header><div><span class="brand">HOSTÉ</span><p class="muted">Admin Console</p></div><div style="text-align:right"><h1>REFUND RECEIPT</h1><p class="muted">Preview - Not proof of a transaction</p></div></header><div class="issued"><div><p class="muted">Issued To</p><strong>${e(receipt.customer)}</strong>${receipt.customerEmail ? `<p class="muted">Email: ${e(receipt.customerEmail)}</p>` : ""}</div><dl><div><dt>Receipt Number</dt><dd>${e(receipt.reference)}</dd></div><div><dt>Date Issued</dt><dd>${e(receiptDate(receipt.createdAt))}</dd></div><div><dt>Payment ID</dt><dd>${e(receipt.paymentReference)}</dd></div><div><dt>Status</dt><dd>PREVIEW</dd></div></dl></div>${booking ? `<div class="booking"><span class="muted">Associated Booking:</span> <strong>${e(booking.title)} (${e(booking.reference)})</strong><br><span class="muted">Event Date:</span> <strong>${e(receiptDate(booking.date))} · ${e(booking.location)}</strong></div>` : ""}<table><thead><tr><th>Description</th><th>Method</th><th>Amount</th></tr></thead><tbody>${receiptRows(
    receipt,
  )
    .map(
      (row) =>
        `<tr><td>${e(row.description)}</td><td>${e(row.method)}</td><td>${e(row.amount)}</td></tr>`,
    )
    .join(
      "",
    )}</tbody></table><div class="net"><div><h2>Net Refund Amount (Preview)</h2><p class="muted">Return to original payment method</p></div><strong class="amount">${e(receiptMoney(receipt.totalRefund))}</strong></div><div class="destination"><strong>Payout Destination</strong><p>${e(receipt.destination)} · ${e(receipt.delivery)}</p><p>Transaction Reference: Not submitted</p></div><footer><div><p class="muted">Prepared By</p><strong>Hosté Admin Preview</strong><p class="muted">Payment Operations</p></div><div class="stamp">PREVIEW<br>HOSTÉ SYSTEM</div></footer><p class="note">PREVIEW ONLY - No money was refunded. This is not proof of a completed transaction.<br>Quote receipt reference ${e(receipt.reference)} when contacting support.</p></article></body></html>`;
}
export function printRefundReceipt(
  receipt: RefundReceipt,
  onError: () => void = () => {},
) {
  const frame = document.createElement("iframe");
  frame.title = "Print refund receipt";
  frame.style.position = "fixed";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  frame.srcdoc = createRefundReceiptHtml(receipt, readReceiptTheme());
  frame.onload = async () => {
    try {
      await frame.contentDocument?.fonts.ready;
      const target = frame.contentWindow;
      if (!target) throw new Error("Print window is unavailable.");
      target.onafterprint = () => frame.remove();
      target.focus();
      target.print();
    } catch {
      frame.remove();
      onError();
    }
  };
  document.body.appendChild(frame);
}
export async function downloadRefundReceipt(receipt: RefundReceipt) {
  const { createRefundReceiptPdf } = await import("./refund.receipt.pdf");
  const responses = await Promise.all([
    fetch("/fonts/dejavu-sans.ttf"),
    fetch("/fonts/dejavu-sans-bold.ttf"),
  ]);
  if (responses.some((response) => !response.ok))
    throw new Error("Unable to load receipt fonts.");
  const [regular, bold] = await Promise.all(
    responses.map((response) => response.arrayBuffer()),
  );
  const bytes = await createRefundReceiptPdf(
    receipt,
    { regular, bold },
    readReceiptTheme(),
  );
  const blob = new Blob([new Uint8Array(bytes).buffer], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = receiptFilename(receipt);
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
