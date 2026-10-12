import type { PDFFont } from "pdf-lib";
import {
  receiptDate,
  receiptMoney,
  receiptRows,
  type ReceiptTheme,
} from "./refund.receipt";
import type { RefundReceipt } from "./types/transactions.types";

export async function createRefundReceiptPdf(
  receipt: RefundReceipt,
  fonts: { regular: ArrayBuffer | Uint8Array; bold: ArrayBuffer | Uint8Array },
  theme: ReceiptTheme,
) {
  const { PDFDocument, rgb } = await import("pdf-lib");
  const { default: fontkit } = await import("@pdf-lib/fontkit");
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const regular = await doc.embedFont(fonts.regular, { subset: true });
  const bold = await doc.embedFont(fonts.bold, { subset: true });
  const color = (hex: string) => {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error("Invalid receipt theme.");
    return rgb(
      parseInt(hex.slice(1, 3), 16) / 255,
      parseInt(hex.slice(3, 5), 16) / 255,
      parseInt(hex.slice(5, 7), 16) / 255,
    );
  };
  const colors = {
    text: color(theme.text),
    muted: color(theme.muted),
    green: color(theme.secondary),
    orange: color(theme.primary),
    border: color(theme.border),
    surface: color(theme.surface),
    paper: color(theme.background),
  };
  let page = doc.addPage([595.28, 841.89]);
  let y = 790;
  const newPage = () => {
    page = doc.addPage([595.28, 841.89]);
    y = 790;
    page.drawRectangle({
      x: 0,
      y: 0,
      width: 595.28,
      height: 841.89,
      color: colors.paper,
    });
  };
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 595.28,
    height: 841.89,
    color: colors.paper,
  });
  const wrap = (value: string, font: PDFFont, size: number, width: number) => {
    const lines: string[] = [];
    let line = "";
    for (const character of value) {
      if (
        character === "\n" ||
        font.widthOfTextAtSize(line + character, size) > width
      ) {
        lines.push(line);
        line = character === "\n" ? "" : character;
      } else line += character;
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  };
  const text = (
    value: string,
    x: number,
    top: number,
    width: number,
    size = 9,
    strong = false,
    ink = colors.text,
  ) => {
    const font = strong ? bold : regular;
    const lines = wrap(value, font, size, width);
    lines.forEach((line, index) =>
      page.drawText(line, {
        x,
        y: top - index * (size + 4),
        size,
        font,
        color: ink,
      }),
    );
    return lines.length * (size + 4);
  };
  const line = () =>
    page.drawLine({
      start: { x: 42, y },
      end: { x: 553, y },
      thickness: 0.6,
      color: colors.border,
    });
  text("HOSTÉ", 42, y, 160, 18, true);
  text("Admin Console", 42, y - 18, 180, 8, false, colors.muted);
  text("REFUND RECEIPT", 355, y, 198, 17, true);
  text(
    "Preview - Not proof of a transaction",
    355,
    y - 19,
    198,
    8,
    false,
    colors.muted,
  );
  y -= 48;
  line();
  y -= 28;
  const customerTop = y;
  text("Issued To", 42, y, 230, 8, false, colors.muted);
  const customerHeight = text(receipt.customer, 42, y - 17, 230, 11, true);
  let customerBottom = y - 17 - customerHeight;
  if (receipt.customerEmail)
    customerBottom -= text(
      `Email: ${receipt.customerEmail}`,
      42,
      customerBottom,
      230,
      8,
      false,
      colors.muted,
    );
  for (const [label, value] of [
    ["Receipt Number", receipt.reference],
    ["Date Issued", receiptDate(receipt.createdAt)],
    ["Payment ID", receipt.paymentReference],
    ["Status", "PREVIEW"],
  ]) {
    text(label, 300, y, 85, 8, false, colors.muted);
    const height = text(
      value,
      390,
      y,
      163,
      8,
      true,
      label === "Status" ? colors.green : colors.text,
    );
    y -= Math.max(18, height + 4);
  }
  y = Math.min(y, customerBottom, customerTop - 80) - 20;
  if (receipt.booking) {
    const content = `${receipt.booking.title} (${receipt.booking.reference})\n${receiptDate(receipt.booking.date)} · ${receipt.booking.location}`;
    const count = wrap(content, bold, 9, 352).length;
    const height = Math.max(52, count * 13 + 20);
    page.drawRectangle({
      x: 42,
      y: y - height,
      width: 511,
      height,
      color: colors.surface,
    });
    text(
      "Associated Booking\nEvent Date",
      55,
      y - 17,
      135,
      8,
      false,
      colors.muted,
    );
    text(content, 195, y - 17, 342, 9, true);
    y -= height + 26;
  }
  page.drawRectangle({
    x: 42,
    y: y - 28,
    width: 511,
    height: 28,
    color: colors.surface,
  });
  text("Description", 55, y - 18, 260, 8, true, colors.muted);
  text("Method", 345, y - 18, 90, 8, true, colors.muted);
  text("Amount", 456, y - 18, 85, 8, true, colors.muted);
  y -= 42;
  for (const row of receiptRows(receipt)) {
    const heights = [
      text(row.description, 55, y, 265, 9, true),
      text(row.method, 345, y, 90, 8, false, colors.muted),
      text(row.amount, 447, y, 94, 9, true),
    ];
    y -= Math.max(...heights) + 12;
    line();
    y -= 16;
  }
  y -= 14;
  text("Net Refund Amount (Preview)", 55, y, 300, 11, true);
  text(receiptMoney(receipt.totalRefund), 394, y, 147, 17, true, colors.green);
  y -= 19;
  text("Return to original payment method", 55, y, 330, 8, false, colors.muted);
  y -= 38;
  const delivery = `${receipt.destination} · ${receipt.delivery}\nTransaction Reference: Not submitted`;
  const boxHeight = Math.max(
    68,
    wrap(delivery, regular, 9, 471).length * 13 + 35,
  );
  if (y - boxHeight < 135) newPage();
  page.drawRectangle({
    x: 42,
    y: y - boxHeight,
    width: 511,
    height: boxHeight,
    color: colors.surface,
    borderColor: colors.border,
    borderWidth: 0.6,
  });
  text("Payout Destination", 55, y - 18, 400, 9, true, colors.green);
  text(delivery, 55, y - 37, 471, 9, false, colors.green);
  y -= boxHeight + 30;
  if (y < 110) newPage();
  line();
  y -= 24;
  text("Prepared By", 42, y, 260, 8, false, colors.muted);
  text("Hosté Admin Preview", 42, y - 16, 260, 10, true);
  text("Payment Operations", 42, y - 32, 260, 8, false, colors.muted);
  page.drawRectangle({
    x: 424,
    y: y - 37,
    width: 129,
    height: 49,
    borderColor: colors.orange,
    borderWidth: 0.7,
  });
  text("PREVIEW\nHOSTÉ SYSTEM", 441, y - 6, 100, 8, true, colors.orange);
  y -= 72;
  const disclaimer =
    "PREVIEW ONLY - No money was refunded. This is not proof of a completed transaction.";
  text(disclaimer, 42, y, 511, 8, false, colors.muted);
  text(
    `Quote receipt reference ${receipt.reference} when contacting support.`,
    42,
    y - 24,
    511,
    8,
    false,
    colors.muted,
  );
  doc.setTitle("Hosté Refund Preview Receipt");
  doc.setSubject("Preview only - no money refunded");
  doc.setCreator("Hosté Admin Preview");
  return doc.save();
}
