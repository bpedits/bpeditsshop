import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin-session";
import { ORDER_STATUS_LABEL, readAllOrderStatuses } from "@/lib/admin-store";
import { listAllOrders } from "@/lib/order-store";

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",;\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const admin = await getAdminContext();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "Nicht angemeldet." }, { status: 401 });
  }

  const [orders, statusMap] = await Promise.all([listAllOrders(), readAllOrderStatuses()]);
  const rows: string[] = [];
  rows.push(
    [
      "Bestellnummer",
      "Eingegangen am",
      "Status",
      "Status-Aktualisierung",
      "Kunde",
      "Firma",
      "E-Mail",
      "Bundesland",
      "PLZ",
      "Ort",
      "Strasse",
      "Adresszusatz",
      "Positionen",
      "Summe EUR",
      "Rabattcode",
      "Interne Notiz",
      "Kundennotiz",
    ]
      .map(csvEscape)
      .join(";"),
  );

  for (const order of orders) {
    const status = statusMap.get(order.orderRef);
    const statusLabel = status?.status ? ORDER_STATUS_LABEL[status.status] : ORDER_STATUS_LABEL.open;

    const itemSummary = order.lines
      .map((l) => `${l.qty}x ${l.productName} [${l.sku}]`)
      .join(" | ");

    rows.push(
      [
        order.orderRef,
        order.createdAtIso,
        statusLabel,
        status?.updatedAtIso ?? "",
        order.name,
        order.company ?? "",
        order.email,
        order.shipping.bundeslandLabel,
        order.shipping.postalCode,
        order.shipping.city,
        order.shipping.streetLine1,
        order.shipping.streetLine2 ?? "",
        itemSummary,
        order.totalEur.toFixed(2),
        order.promoCode ?? "",
        status?.internalNote ?? "",
        order.note ?? "",
      ]
        .map(csvEscape)
        .join(";"),
    );
  }

  const body = "\uFEFF" + rows.join("\r\n") + "\r\n";
  const fileName = `bestellungen_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
