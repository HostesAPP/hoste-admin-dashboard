import assert from "node:assert/strict";
import { test } from "node:test";
import { createMockRefundAdapter } from "./refund.adapter";
import { mockTransactionsAdapter } from "./transactions.adapter";
import { createRefundSchema } from "./schemas/refund.schema";
import { createRefundReceiptHtml } from "./refund.receipt";
import { createRefundReceiptPdf } from "./refund.receipt.pdf";
import { readFileSync } from "node:fs";
import { PDFDocument } from "pdf-lib";
import { MOCK_BOOKINGS } from "../bookings/data/bookings.data";
import { MOCK_TRANSACTIONS } from "./data/transactions.data";
import { MOCK_REFUNDS } from "./data/payments.data";
import { MOCK_REFUND_AVAILABLE_AMOUNTS } from "./data/refunds.data";
const filters = {
  search: "",
  date: "LAST_30_DAYS",
  status: "ALL",
  method: "ALL",
} as const;
test("every mock transaction links to an existing booking", () => {
  for (const transaction of MOCK_TRANSACTIONS) {
    const booking = MOCK_BOOKINGS.find((item) => item.id === transaction.bookingId);
    assert.ok(booking);
    assert.equal(transaction.bookingReference, booking.bookingCode);
  }
});
test("refund contexts resolve existing payments, bookings, and history without separate fixtures", async () => {
  const adapter = createMockRefundAdapter();
  for (const transaction of MOCK_TRANSACTIONS) {
    const context = await adapter.load(transaction.payment.id);
    const booking = MOCK_BOOKINGS.find((item) => item.id === transaction.bookingId)!;
    assert.ok(context);
    assert.deepEqual(context.transaction, transaction);
    assert.equal(context.booking?.title, booking.eventName);
    assert.equal(context.booking?.date, booking.eventDate);
    assert.equal(context.booking?.status, booking.status);
    assert.equal(context.booking?.location, booking.location);
    assert.equal(context.booking?.hostCount, null);
    assert.equal(context.booking?.imageUrl, null);
    assert.equal(context.availableAmount, MOCK_REFUND_AVAILABLE_AMOUNTS[transaction.payment.id]);
    const history = MOCK_REFUNDS.filter((refund) => refund.paymentId === transaction.payment.id);
    assert.deepEqual(context.recentRefunds.map((refund) => refund.id), history.map((refund) => refund.id));
    assert.ok(context.recentRefunds.every((refund) => refund.status === null));
  }
});
test("preview receipts preserve confirmed values and escape untrusted content", async () => {
  const adapter = createMockRefundAdapter();
  const result = await adapter.review("pay-101", {
    amount: "50000",
    reason: "customer-request",
    description: "Admin-only review note",
    destination: "Original Payment Method",
  });
  assert.equal(result.receipt.preview, true);
  assert.equal(result.receipt.totalRefund, 50000);
  assert.match(result.receipt.reference, /^PREVIEW-/);
  const html = createRefundReceiptHtml({...result.receipt,customer:'<script>alert("x")</script>'});
  assert.match(html, /No money was refunded/);
  assert.equal(html.includes("<script>"), false);
  assert.match(html, /&lt;script&gt;/);
  assert.equal(html.includes("Admin-only review note"),false);
  assert.equal(result.receipt.amountPaid,150000);
  assert.equal((await adapter.load("pay-101"))!.recentRefunds.length, 1);
});
test("PDF receipts are valid one-page documents with embedded Unicode fonts",async()=>{
  const result=await createMockRefundAdapter().review("pay-101",{amount:"50000",reason:"customer-request",description:"",destination:"Original Payment Method"});
  const receipt={...result.receipt,customer:"Ọlá Odúnwósù"};
  const bytes=await createRefundReceiptPdf(receipt,{regular:readFileSync("public/fonts/dejavu-sans.ttf"),bold:readFileSync("public/fonts/dejavu-sans-bold.ttf")},{primary:"#444444",secondary:"#222222",text:"#000000",muted:"#666666",border:"#cccccc",surface:"#eeeeee",background:"#ffffff"});
  assert.equal(Buffer.from(bytes.slice(0,4)).toString(),"%PDF");
  const pdf=await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(),1);
  assert.equal(pdf.getTitle(),"Hosté Refund Preview Receipt");
});
const draft = {
  amount: "50000",
  reason: "customer-request",
  description: "",
  destination: "Original Payment Method",
} as const;
test("transactions filter, paginate, and return isolated snapshots", async () => {
  const first = await mockTransactionsAdapter.list(filters, 1, 3);
  assert.equal(first.total, 7);
  assert.equal(first.rows.length, 3);
  const second = await mockTransactionsAdapter.list(filters, 2, 3);
  assert.notEqual(second.rows[0].payment.id, first.rows[0].payment.id);
  first.rows[0].payment.payerProfileName = "Changed";
  assert.equal(
    MOCK_TRANSACTIONS[0].payment.payerProfileName,
    "Luxe Event Planners",
  );
  assert.equal(
    (await mockTransactionsAdapter.list({ ...filters, status: "FAILED" }, 1, 7))
      .total,
    1,
  );
  assert.equal(
    (await mockTransactionsAdapter.list({ ...filters, method: "PAYPAL" }, 1, 7))
      .total,
    2,
  );
  assert.equal(
    (
      await mockTransactionsAdapter.list(
        { ...filters, search: "does not exist" },
        1,
        7,
      )
    ).total,
    0,
  );
  assert.equal(
    (await mockTransactionsAdapter.list({ ...filters, date: "TODAY" }, 1, 7))
      .total,
    2,
  );
});
test("retry validates eligibility and never changes payment state", async () => {
  await assert.rejects(
    mockTransactionsAdapter.retry("pay-101"),
    /cannot be retried/,
  );
  assert.match(
    (await mockTransactionsAdapter.retry("pay-103")).message,
    /No payment/,
  );
  assert.equal(MOCK_TRANSACTIONS[2].payment.status, "Failed");
});
test("refund form rejects invalid amounts, reasons, wallet destination, and long notes", () => {
  const schema = createRefundSchema(105000, ["customer-request"]);
  assert.equal(schema.safeParse(draft).success, true);
  for (const amount of ["", "0", "-1", "105001", "1.234", "NaN", "1e3"])
    assert.equal(schema.safeParse({ ...draft, amount }).success, false);
  assert.equal(schema.safeParse({ ...draft, reason: "" }).success, false);
  assert.equal(
    schema.safeParse({ ...draft, destination: "Hoste Wallet" }).success,
    false,
  );
  assert.equal(
    schema.safeParse({ ...draft, description: "a".repeat(251) }).success,
    false,
  );
});
test("refund quote and review do not transfer money, change balances, or create records", async () => {
  const adapter = createMockRefundAdapter();
  const before = await adapter.load("pay-101");
  assert.deepEqual(await adapter.quote("pay-101", draft), {
    amount: 50000,
    processingFee: 0,
    totalRefund: 50000,
  });
  assert.match(
    (await adapter.review("pay-101", draft)).message,
    /No money was refunded/,
  );
  assert.deepEqual(await adapter.load("pay-101"), before);
  before!.availableAmount = 1;
  assert.equal((await adapter.load("pay-101"))!.availableAmount, 105000);
});
test("refund adapter rejects missing, unavailable, and over-limit payments", async () => {
  const adapter = createMockRefundAdapter();
  assert.equal(await adapter.load("missing"), null);
  await assert.rejects(adapter.quote("missing", draft), /not found/);
  await assert.rejects(adapter.quote("pay-103", draft), /not eligible/);
  await assert.rejects(
    adapter.quote("pay-101", { ...draft, amount: "105001" }),
    /exceeds/,
  );
  assert.equal((await adapter.load("pay-101"))!.recentRefunds[0].id, "ref-301");
});
